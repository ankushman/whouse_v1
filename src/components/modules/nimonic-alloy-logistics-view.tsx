"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Flame } from 'lucide-react';

interface NimonicAlloyRecord {
  id: string; batchNo: string; city: string; manufacturer: string; nimonicGrade: string;
  application: string; purityPercent: number; maxTempC: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const nimonicAlloyRecords: NimonicAlloyRecord[] = [
  { id: 'NMA-0001', batchNo: 'NMA-B2401', city: 'Bengaluru', manufacturer: 'MIDHANI', nimonicGrade: 'Nimonic 80A', application: 'HAL Tejas Mk2 Turbine Blade', purityPercent: 99.4, maxTempC: 815, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'Nimonic 80A wrought superalloy for HAL Tejas Mk2 GE F414 turbofan HP turbine blade forging &#8594; 20Cr-2Ti-Al &#8594; &#8377;920Cr for 60 tonnes &#8594; India &#8377;6,400Cr nimonic &#8594; HAL 120 engines &#8594; 815&#176;C &#8594; &#8594; Blade &#8594; &#8594; N080A &#8594; &#8594; Aerospace' },
  { id: 'NMA-0002', batchNo: 'NMA-B2402', city: 'Hyderabad', manufacturer: 'DRDO DMRL', nimonicGrade: 'Nimonic 90', application: 'ISRO GSLV Mk3 Turbo Pump', purityPercent: 99.6, maxTempC: 920, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Nimonic 90 superalloy for ISRO GSLV Mk3 CE-20 cryogenic turbopump impeller and casing &#8594; 20Cr-18Co-Ti &#8594; &#8377;860Cr for 45 tonnes &#8594; India &#8377;7,200Cr nimonic &#8594; ISRO 8 engines &#8594; 920&#176;C &#8594; &#8594; Impeller &#8594; &#8594; N090 &#8594; &#8594; Space' },
  { id: 'NMA-0003', batchNo: 'NMA-B2403', city: 'Mumbai', manufacturer: 'Bharat Forge', nimonicGrade: 'Nimonic 105', application: 'BHEL 800MW Gas Turbine Blade', purityPercent: 99.2, maxTempC: 950, investmentCr: 980, status: 'Delivered', priority: 'Critical', origin: 'Bharat Forge Pune (MH)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 3, zone: 'West', remarks: 'Nimonic 105 cast superalloy for BHEL 800MW advanced class gas turbine HP stage blade &#8594; 15Co-5Mo-Ti-Al &#8594; &#8377;980Cr for 80 tonnes &#8594; India &#8377;8,600Cr nimonic &#8594; BHEL 20 turbines &#8594; 950&#176;C &#8594; &#8594; Blade &#8594; &#8594; N105 &#8594; &#8594; Power' },
  { id: 'NMA-0004', batchNo: 'NMA-B2404', city: 'Chennai', manufacturer: 'Sterlite Technologies', nimonicGrade: 'Nimonic 263', application: 'BHAVINI PFBR Steam Generator', purityPercent: 99.3, maxTempC: 870, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Nimonic 263 superalloy tube for BHAVINI PFBR sodium-heated steam generator superheater &#8594; 20Cr-20Ni-6Mo &#8594; &#8377;940Cr for 70 tonnes &#8594; India &#8377;7,800Cr nimonic &#8594; BHAVINI 2 reactors &#8594; 870&#176;C &#8594; &#8594; Tube &#8594; &#8594; N263 &#8594; &#8594; Nuclear' },
  { id: 'NMA-0005', batchNo: 'NMA-B2405', city: 'Pune', manufacturer: 'Tata Advanced Materials', nimonicGrade: 'Nimonic 75', application: 'JSW Steel Hot Strip Mill Roll', purityPercent: 99.1, maxTempC: 750, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Tata Advanced Pune (MH)', destination: 'JSW Steel Vijaynagar (KA)', shipDate: '2026-07-19', transitDays: 5, zone: 'West', remarks: 'Nimonic 75 superalloy for JSW Steel hot strip mill work roll shell and backup roll &#8594; 20Cr-0.4Ti &#8594; &#8377;560Cr for 120 tonnes &#8594; India &#8377;3,200Cr nimonic &#8594; JSW 4 mills &#8594; 750&#176;C &#8594; &#8594; Roll &#8594; &#8594; N075 &#8594; &#8594; Steel' },
  { id: 'NMA-0006', batchNo: 'NMA-B2406', city: 'Kolkata', manufacturer: 'Hindustan Steel', nimonicGrade: 'Nimonic PE16', application: 'DRDO Hypersonic Missile Nose Cone', purityPercent: 99.5, maxTempC: 880, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'DRDO Balasore (OD)', shipDate: '2026-07-20', transitDays: 1, zone: 'East', remarks: 'Nimonic PE16 superalloy for DRDO HSTDV hypersonic scramjet engine combustion chamber liner &#8594; 16Cr-3Mo-Ni &#8594; &#8377;820Cr for 35 tonnes &#8594; India &#8377;6,200Cr nimonic &#8594; DRDO 6 missiles &#8594; 880&#176;C &#8594; &#8594; Liner &#8594; &#8594; PE16 &#8594; &#8594; Defense' },
  { id: 'NMA-0007', batchNo: 'NMA-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Alloys', nimonicGrade: 'Nimonic 115', application: 'L&T Naval Gas Turbine Disc', purityPercent: 99.3, maxTempC: 980, investmentCr: 740, status: 'Delivered', priority: 'High', origin: 'MIDHANI Hyderabad (TG)', destination: 'L&T Vadodara (GJ)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Nimonic 115 superalloy for L&T LM2500 naval gas turbine HP compressor disc &#8594; 15Cr-15Co-5Mo &#8594; &#8377;740Cr for 55 tonnes &#8594; India &#8377;5,400Cr nimonic &#8594; L&T 8 ships &#8594; 980&#176;C &#8594; &#8594; Disc &#8594; &#8594; N115 &#8594; &#8594; Naval' },
  { id: 'NMA-0008', batchNo: 'NMA-B2408', city: 'Guwahati', manufacturer: 'Assam Alloys', nimonicGrade: 'Nimonic 80', application: 'SAIL Blast Furnace Hot Blast Valve', purityPercent: 98.8, maxTempC: 720, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Assam Alloys Guwahati (AS)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: 'Nimonic 80 superalloy for SAIL blast furnace hot blast stove valve seat and disc &#8594; 20Cr-1Ti &#8594; &#8377;380Cr for 180 tonnes &#8594; India &#8377;2,200Cr nimonic &#8594; SAIL 6 furnaces &#8594; 720&#176;C &#8594; &#8594; Valve &#8594; &#8594; N080 &#8594; &#8594; Steel' },
  { id: 'NMA-0009', batchNo: 'NMA-B2409', city: 'Coimbatore', manufacturer: 'TN Alloys', nimonicGrade: 'Nimonic C-263', application: 'Wipro Aerospace Thrust Reverser', purityPercent: 99.1, maxTempC: 850, investmentCr: 480, status: 'In Transit', priority: 'High', origin: 'TN Alloys Coimbatore (TN)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 4, zone: 'South', remarks: 'Nimonic C-263 superalloy for Wipro aerospace Boeing 737 thrust reverser cascade vane &#8594; 20Cr-6Mo &#8594; &#8377;480Cr for 40 tonnes &#8594; India &#8377;3,000Cr nimonic &#8594; Wipro 200 assemblies &#8594; 850&#176;C &#8594; &#8594; Vane &#8594; &#8594; C263 &#8594; &#8594; Aerospace' },
  { id: 'NMA-0010', batchNo: 'NMA-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Superalloys', nimonicGrade: 'Nimonic 81', application: 'Tata Steel Reheating Furnace', purityPercent: 98.6, maxTempC: 700, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Superalloys Ahmedabad (GJ)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Nimonic 81 superalloy for Tata Steel slab reheating furnace radiant tube and burner nozzle &#8594; 30Cr-0.4Ti &#8594; &#8377;340Cr for 200 tonnes &#8594; India &#8377;1,800Cr nimonic &#8594; Tata 10 furnaces &#8594; 700&#176;C &#8594; &#8594; Tube &#8594; &#8594; N081 &#8594; &#8594; Steel' },
  { id: 'NMA-0011', batchNo: 'NMA-B2411', city: 'Lucknow', manufacturer: 'UP Superalloys', nimonicGrade: 'Nimonic PK33', application: 'IGCAR Fast Reactor Fuel Clad', purityPercent: 99.7, maxTempC: 900, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Nimonic PK33 superalloy for IGCAR fast breeder test reactor advanced fuel cladding &#8594; 18Cr-3Mo-Ti &#8594; &#8377;860Cr for 30 tonnes &#8594; India &#8377;6,800Cr nimonic &#8594; IGCAR 3 reactors &#8594; 900&#176;C &#8594; &#8594; Clad &#8594; &#8594; PK33 &#8594; &#8594; Nuclear' },
  { id: 'NMA-0012', batchNo: 'NMA-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Superalloys', nimonicGrade: 'Nimonic 718', application: 'GRSE Submarine Reactor Shield', purityPercent: 99.5, maxTempC: 860, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Superalloys Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Nimonic 718 superalloy for GRSE Project 75I nuclear submarine reactor pressure vessel shield bracket &#8594; 19Cr-5Nb-3Mo &#8594; &#8377;940Cr for 50 tonnes &#8597; India &#8377;7,400Cr nimonic &#8594; GRSE 6 submarines &#8594; 860&#176;C &#8594; &#8594; Bracket &#8594; &#8594; N718 &#8594; &#8594; Naval' },
  { id: 'NMA-0013', batchNo: 'NMA-B2413', city: 'Bhopal', manufacturer: 'BHEL Superalloy Div', nimonicGrade: 'Nimonic 901', application: 'BHEL Steam Turbine Bolt', purityPercent: 99.0, maxTempC: 800, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Nimonic 901 superalloy for BHEL 660MW supercritical steam turbine HP-LP coupling bolt &#8594; 13Cr-6Mo-Ti &#8594; &#8377;520Cr for 90 tonnes &#8594; India &#8377;3,600Cr nimonic &#8594; BHEL 30 turbines &#8594; 800&#176;C &#8594; &#8594; Bolt &#8594; &#8594; N901 &#8594; &#8594; Power' },
  { id: 'NMA-0014', batchNo: 'NMA-B2414', city: 'Rourkela', manufacturer: 'SAIL Superalloy', nimonicGrade: 'Nimonic AP1', application: 'Reliance Refinery Cracking Tube', purityPercent: 98.9, maxTempC: 1050, investmentCr: 620, status: 'Delivered', priority: 'High', origin: 'SAIL Rourkela (OD)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Nimonic AP1 superalloy for Reliance Jamnagar FCC unit catalytic cracking tube and return bend &#8594; 50Cr-50Ni &#8594; &#8377;620Cr for 100 tonnes &#8594; India &#8377;4,200Cr nimonic &#8594; Reliance 4 FCC units &#8594; 1050&#176;C &#8594; &#8594; Tube &#8594; &#8594; AP1 &#8594; &#8594; Oil &amp; Gas' },
];

export default function NimonicAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'registry', label: 'Registry', icon: Flame },
    { id: 'analytics', label: 'Analytics', icon: Flame },
    { id: 'insights', label: 'Insights', icon: Flame },
  ];

  const filteredRecords = useMemo(() => {
    return nimonicAlloyRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nimonicGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    nimonicAlloyRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = nimonicAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = nimonicAlloyRecords.reduce((s: number, r) => s + r.purityPercent, 0) / nimonicAlloyRecords.length;
    const delayed = nimonicAlloyRecords.filter((r) => r.status === 'Delayed').length;
    const critical = nimonicAlloyRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#ea580c';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Nimonic Alloy Logistics" description="Indian nimonic nickel-chromium superalloy gas turbine, aerospace, nuclear and industrial high-temperature supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / nimonicAlloyRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = nimonicAlloyRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {nimonicAlloyRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.nimonicGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.nimonicGrade}</span></div>
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {nimonicAlloyRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; nimonicAlloyRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = nimonicAlloyRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; nimonicAlloyRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; nimonicAlloyRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / nimonicAlloyRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Gas Turbine Superalloy Chain</div><div className="text-xs text-muted-foreground mt-1">BHEL 800MW blade &#8594; HAL Tejas Mk2 F414 &#8594; L&T naval LM2500 &#8594; &#8377;2,640Cr combined &#8594; highest value segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Nuclear Fast Reactor Programme</div><div className="text-xs text-muted-foreground mt-1">BHAVINI PFBR steam generator &#8594; IGCAR fuel cladding &#8594; GRSE submarine shield &#8594; &#8377;2,740Cr combined &#8594; critical strategic</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Space &amp; Hypersonic</div><div className="text-xs text-muted-foreground mt-1">ISRO GSLV turbopump &#8594; DRDO HSTDV scramjet liner &#8594; &#8377;1,680Cr combined &#8594; cutting-edge programmes</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">NMA-B2412 GRSE submarine reactor shield delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I schedule risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 nimonic grades spanning aerospace, nuclear, power, steel, defense, oil and gas &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL turbine &#8594; ISRO turbopump &#8594; BHEL gas turbine &#8594; BHAVINI SG &#8594; DRDO missile &#8594; IGCAR clad &#8594; GRSE submarine</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL dominate &#8594; Bharat Forge &#8594; Tata Advanced &#8594; Sterlite emerging</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Temperature Range</div><div className="text-xs text-muted-foreground mt-1">Grades span 700&#176;C (Nimonic 81) to 1050&#176;C (Nimonic AP1) &#8594; covering every Indian high-temp application</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
