"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { FlaskConical } from 'lucide-react';

interface CalciumCarbideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; ccGrade: string;
  application: string; purityPercent: number; gasYieldLKG: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const calciumCarbideRecords: CalciumCarbideRecord[] = [
  { id: 'CC-0001', batchNo: 'CC-B2401', city: 'Mumbai', manufacturer: 'Gujurat Carbide', ccGrade: 'CaC2 295 L/KG Acetylene', application: 'Larsen &amp; Toubro Shipyard Welding', purityPercent: 98.8, gasYieldLKG: 295, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Carbide Rajkot (GJ)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Calcium carbide 295 L/KG for L&amp;T Kattupalli shipyard oxy-acetylene plate cutting and structural welding &#8594; 85% CaC2 &#8594; &#8377;720Cr for 12,000 tonnes &#8594; India &#8377;5,200Cr CaC2 gas &#8594; L&amp;T 8 warships &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Acetylene &#8594; &#8594; Naval' },
  { id: 'CC-0002', batchNo: 'CC-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', ccGrade: 'CaC2 290 Military Grade', application: 'BEL BrahMos Launcher Frame', purityPercent: 99.2, gasYieldLKG: 290, investmentCr: 840, status: 'In Transit', priority: 'Critical', origin: 'Kerala Carbide Kochi (KL)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Military-grade calcium carbide for BEL BrahMos missile launcher frame field welding and cutting &#8594; 88% CaC2 &#8594; &#8377;840Cr for 6,000 tonnes &#8594; India &#8377;6,400Cr CaC2 military &#8594; BEL 200 launchers &#8594; 290 L/KG &#8594; &#8594; Lump &#8594; &#8594; Welding &#8594; &#8594; Defense' },
  { id: 'CC-0003', batchNo: 'CC-B2403', city: 'Chennai', manufacturer: 'Tata Steel', ccGrade: 'CaC2 280 Steel Desulf', application: 'JSW Steel Desulfurization', purityPercent: 97.6, gasYieldLKG: 280, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Tata Carbide Jamshedpur (JH)', destination: 'JSW Steel Salem (TN)', shipDate: '2026-07-17', transitDays: 3, zone: 'East', remarks: 'Calcium carbide 280 L/KG for JSW Steel LD converter secondary steel desulfurization injection &#8594; 82% CaC2 &#8594; &#8377;520Cr for 18,000 tonnes &#8594; India &#8377;3,600Cr CaC2 desulf &#8594; JSW 6 converters &#8594; 280 L/KG &#8594; &#8594; Granule &#8594; &#8594; Desulf &#8594; &#8594; Steel' },
  { id: 'CC-0004', batchNo: 'CC-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', ccGrade: 'CaC2 295 Auto Grade', application: 'Bharat Forge Die Welding', purityPercent: 98.5, gasYieldLKG: 295, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'AP Carbide Visakhapatnam (AP)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Auto-grade calcium carbide for Bharat Forge die repair and crankshaft forging torch brazing &#8594; 85% CaC2 &#8594; &#8377;480Cr for 5,000 tonnes &#8594; India &#8377;3,200Cr CaC2 auto &#8594; Bharat Forge 200 dies &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Auto' },
  { id: 'CC-0005', batchNo: 'CC-B2405', city: 'Kolkata', manufacturer: 'Shyam Carbide', ccGrade: 'CaC2 270 Low Cost', application: 'SAIL Rail Welding', purityPercent: 97.2, gasYieldLKG: 270, investmentCr: 340, status: 'In Transit', priority: 'Medium', origin: 'Shyam Carbide Asansol (WB)', destination: 'SAIL Durgapur (WB)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Low-cost calcium carbide for SAIL Durgapur rail track flash-butt welding and thermite welding &#8594; 78% CaC2 &#8594; &#8377;340Cr for 15,000 tonnes &#8594; India &#8377;2,200Cr CaC2 rail &#8594; SAIL 500 km track &#8594; 270 L/KG &#8594; &#8594; Lump &#8594; &#8594; Rail' },
  { id: 'CC-0006', batchNo: 'CC-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', ccGrade: 'CaC2 290 Pharma Grade', application: 'Sun Pharma Vitamin D Synthesis', purityPercent: 99.4, gasYieldLKG: 290, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'TN Carbide Hosur (TN)', destination: 'Sun Pharma Vadodara (GJ)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Pharma-grade calcium carbide for Sun Pharma vitamin D3 synthesis via isoprenyl intermediates &#8594; 90% CaC2 &#8594; &#8377;560Cr for 2,000 tonnes &#8594; India &#8377;4,200Cr CaC2 pharma &#8594; Sun Pharma 800M doses &#8594; 290 L/KG &#8594; &#8594; Powder &#8594; &#8594; Pharma' },
  { id: 'CC-0007', batchNo: 'CC-B2407', city: 'Pune', manufacturer: 'Mahindra Carbide', ccGrade: 'CaC2 295 Mining', application: 'Coal India Mine Cutting', purityPercent: 98.2, gasYieldLKG: 295, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Carbide Nagpur (MH)', destination: 'Coal India Ranchi (JH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Mining-grade calcium carbide for Coal India underground coal mine rock cutting and roof bolting gas lamp &#8594; 85% CaC2 &#8594; &#8377;440Cr for 8,000 tonnes &#8594; India &#8377;2,800Cr CaC2 mining &#8594; CIL 40 mines &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Mining' },
  { id: 'CC-0008', batchNo: 'CC-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Carbide', ccGrade: 'CaC2 275 Lab Grade', application: 'CSIR Lab Reagent', purityPercent: 99.6, gasYieldLKG: 275, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Carbide Udaipur (RJ)', destination: 'CSIR New Delhi (DL)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Ultra-pure lab-grade calcium carbide for CSIR-NPL acetylene generation standard reference and analytical chemistry &#8594; 95% CaC2 &#8594; &#8377;280Cr for 200 tonnes &#8594; India &#8377;1,600Cr CaC2 lab &#8594; CSIR 50 labs &#8594; 275 L/KG &#8594; &#8594; Powder &#8594; &#8594; Lab' },
  { id: 'CC-0009', batchNo: 'CC-B2409', city: 'Guwahati', manufacturer: 'Assam Carbide', ccGrade: 'CaC2 280 Tea Estate', application: 'Tata Tea Estate Processing', purityPercent: 97.8, gasYieldLKG: 280, investmentCr: 320, status: 'In Transit', priority: 'Medium', origin: 'Assam Carbide Tezpur (AS)', destination: 'Tata Tea Munnar (KL)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Calcium carbide for Tata Tea Munnar tea estate artificial fruit ripening of processing building &#8594; 82% CaC2 &#8594; &#8377;320Cr for 3,000 tonnes &#8594; India &#8377;2,000Cr CaC2 agriculture &#8594; Tata 20 estates &#8594; 280 L/KG &#8594; &#8594; Lump &#8594; &#8594; Agriculture' },
  { id: 'CC-0010', batchNo: 'CC-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Carbide Corp', ccGrade: 'CaC2 295 Pipeline', application: 'Adani Gas Pipeline Welding', purityPercent: 98.4, gasYieldLKG: 295, investmentCr: 620, status: 'Delivered', priority: 'High', origin: 'Gujarat Carbide Ahmedabad (GJ)', destination: 'Adani Hazira (GJ)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'High-yield calcium carbide for Adani natural gas pipeline cross-country route field welding &#8594; 85% CaC2 &#8594; &#8377;620Cr for 10,000 tonnes &#8594; India &#8377;4,400Cr CaC2 pipeline &#8594; Adani 400 km &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Oil &amp; Gas' },
  { id: 'CC-0011', batchNo: 'CC-B2411', city: 'Lucknow', manufacturer: 'UP Carbide Works', ccGrade: 'CaC2 290 FGD', application: 'NTPC Flue Gas Desulf', purityPercent: 98.0, gasYieldLKG: 290, investmentCr: 540, status: 'Delivered', priority: 'Medium', origin: 'UP Carbide Kanpur (UP)', destination: 'NTPC Unchahar (UP)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Calcium carbide for NTPC Unchahar thermal power plant flue gas desulfurization reagent &#8594; 88% CaC2 &#8594; &#8377;540Cr for 6,000 tonnes &#8594; India &#8377;3,600Cr CaC2 FGD &#8594; NTPC 10 units &#8594; 290 L/KG &#8594; &#8594; Granule &#8594; &#8594; Power' },
  { id: 'CC-0012', batchNo: 'CC-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Carbide Works', ccGrade: 'CaC2 290 Submarine', application: 'GRSE Project 75I Hull Weld', purityPercent: 99.3, gasYieldLKG: 290, investmentCr: 920, status: 'Delayed', priority: 'Critical', origin: 'Vizag Carbide Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Naval-grade calcium carbide for GRSE Project 75I submarine pressure hull special welding and oxy-acetylene seam &#8594; 90% CaC2 &#8594; &#8377;920Cr for 4,000 tonnes &#8597; India &#8377;7,600Cr CaC2 submarine &#8594; GRSE 6 submarines &#8597; 290 L/KG &#8597; &#8594; Lump &#8594; &#8594; Naval' },
  { id: 'CC-0013', batchNo: 'CC-B2413', city: 'Bhopal', manufacturer: 'BHEL Carbide Div', ccGrade: 'CaC2 285 Power Plant', application: 'BHEL Boiler Tube Weld', purityPercent: 98.6, gasYieldLKG: 285, investmentCr: 680, status: 'In Transit', priority: 'High', origin: 'BHEL Carbide Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Calcium carbide for BHEL 660MW boiler superheater tube panel welding and header fabrication &#8594; 86% CaC2 &#8594; &#8377;680Cr for 7,000 tonnes &#8594; India &#8377;4,800Cr CaC2 boiler &#8594; BHEL 30 boilers &#8594; 285 L/KG &#8594; &#8594; Lump &#8594; &#8594; Power' },
  { id: 'CC-0014', batchNo: 'CC-B2414', city: 'Rourkela', manufacturer: 'SAIL Carbide Div', ccGrade: 'CaC2 270 General', application: 'Reliance Steel Foundry', purityPercent: 97.4, gasYieldLKG: 270, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'General-purpose calcium carbide for Reliance Jamnagar refinery steel foundry casting cleanup and acetylene generation &#8594; 78% CaC2 &#8594; &#8377;380Cr for 12,000 tonnes &#8594; India &#8377;2,400Cr CaC2 foundry &#8594; Reliance 20 furnaces &#8594; 270 L/KG &#8594; &#8594; Lump &#8594; &#8594; Oil &amp; Gas' },
];

export default function CalciumCarbideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FlaskConical },
    { id: 'registry', label: 'Registry', icon: FlaskConical },
    { id: 'analytics', label: 'Analytics', icon: FlaskConical },
    { id: 'insights', label: 'Insights', icon: FlaskConical },
  ];

  const filteredRecords = useMemo(() => {
    return calciumCarbideRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ccGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    calciumCarbideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = calciumCarbideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = calciumCarbideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / calciumCarbideRecords.length;
    const delayed = calciumCarbideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = calciumCarbideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#7c3aed';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Calcium Carbide Logistics" description="Indian calcium carbide (CaC2) acetylene gas, steel desulfurization, chemical synthesis and mining supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-violet-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-violet-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-violet-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / calciumCarbideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = calciumCarbideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {calciumCarbideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.ccGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.ccGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Gas Yield:</span><span className="font-medium">{record.gasYieldLKG} L/KG</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {calciumCarbideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; calciumCarbideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = calciumCarbideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; calciumCarbideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; calciumCarbideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / calciumCarbideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Naval &amp; Defense Welding</div><div className="text-xs text-muted-foreground mt-1">L&amp;T shipyard &#8594; BEL BrahMos launcher &#8594; GRSE submarine hull driving &#8594; &#8377;2,480Cr combined &#8594; strategic oxy-acetylene</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Steelmaking Desulfurization</div><div className="text-xs text-muted-foreground mt-1">JSW converter &#8594; SAIL rail &#8594; Reliance foundry &#8594; &#8594; &#8377;1,240Cr combined &#8594; secondary metallurgy critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Power &amp; Pipeline Welding</div><div className="text-xs text-muted-foreground mt-1">BHEL boiler &#8594; NTPC FGD &#8594; Adani pipeline &#8594; &#8377;1,840Cr combined &#8594; infrastructure backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">CC-B2412 GRSE Project 75I hull welding delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine welding schedule at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 calcium carbide grades spanning naval, defense, steel, power, pipeline, pharma, mining and agriculture &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">L&amp;T shipyard &#8594; BEL missile launcher &#8594; GRSE submarine hull &#8594; &#8594; national security welding chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Gujarat Carbide &#8594; Kerala Carbide &#8594; AP Carbide lead &#8594; BHEL &#8594; SAIL &#8594; Shyam Carbide drive regional</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Acetylene vs Desulfurization Split</div><div className="text-xs text-muted-foreground mt-1">60% volume for welding/cutting &#8594; 30% for steel desulfurization &#8594; 10% for pharma and specialty &#8594; dual-market dynamics</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
