"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Zap } from 'lucide-react';

interface PhosphorBronzeRecord {
  id: string; batchNo: string; city: string; manufacturer: string; pbGrade: string;
  application: string; purityPercent: number; tensileStrengthMpa: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const phosphorBronzeRecords: PhosphorBronzeRecord[] = [
  { id: 'PBR-0001', batchNo: 'PBR-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', pbGrade: 'PB-5 Sn5 P0.3', application: 'HAL Tejas Mk2 Landing Gear Spring', purityPercent: 99.2, tensileStrengthMpa: 680, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'C5191 phosphor bronze strip for HAL Tejas Mk2 main landing gear oleo-pneumatic suspension spring &#8594; 5% Sn &#8594; &#8377;680Cr for 120 tonnes &#8594; India &#8377;4,200Cr PB spring &#8594; HAL 40 aircraft &#8594; 680 MPa &#8594; &#8594; Strip &#8594; &#8594; C5191 &#8594; &#8594; Aerospace' },
  { id: 'PBR-0002', batchNo: 'PBR-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', pbGrade: 'PB-8 Sn8 P0.1', application: 'BEL Phased Array Radar Connector', purityPercent: 99.5, tensileStrengthMpa: 580, investmentCr: 740, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'High-conductivity PB-8 phosphor bronze for BEL AESA radar RF coaxial connector shell &#8594; 8% Sn &#8594; &#8377;740Cr for 85 tonnes &#8594; India &#8377;5,600Cr PB RF &#8594; BEL 12 radars &#8594; 580 MPa &#8594; &#8594; Wire &#8594; &#8594; C5210 &#8594; &#8594; Defense' },
  { id: 'PBR-0003', batchNo: 'PBR-B2403', city: 'Chennai', manufacturer: 'Sterlite Copper', pbGrade: 'PB-C5441 Spring', application: 'L&T Metro Bogie Bearing', purityPercent: 98.8, tensileStrengthMpa: 520, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'Sterlite Tuticorin (TN)', destination: 'L&T Hyderabad (TG)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'C5441 phosphor bronze bearing bush for L&T Hyderabad metro bogie primary suspension &#8594; 4.5% Sn &#8594; &#8377;560Cr for 200 tonnes &#8594; India &#8377;3,200Cr PB bearing &#8594; L&T 72 bogies &#8594; 520 MPa &#8594; &#8594; Sleeve &#8594; &#8594; C5441 &#8594; &#8594; Rail' },
  { id: 'PBR-0004', batchNo: 'PBR-B2404', city: 'Hyderabad', manufacturer: 'Hindustan Copper', pbGrade: 'PB-10 Sn10 P0.5', application: 'SAIL Continuous Caster Bearing', purityPercent: 98.5, tensileStrengthMpa: 600, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'HCL Khetri (RJ)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'PB-10 phosphor bronze sleeve bearing for SAIL Bhilai continuous casting machine mold oscillation &#8594; 10% Sn &#8594; &#8377;480Cr for 180 tonnes &#8594; India &#8377;3,800Cr PB sleeve &#8594; SAIL 6 casters &#8594; 600 MPa &#8594; &#8594; Bush &#8594; &#8594; C5240 &#8594; &#8594; Steel' },
  { id: 'PBR-0005', batchNo: 'PBR-B2405', city: 'Kolkata', manufacturer: 'Bharat Cable', pbGrade: 'PB-5 Low P', application: 'Tata Power Transformer Tap Changer', purityPercent: 99.1, tensileStrengthMpa: 450, investmentCr: 420, status: 'In Transit', priority: 'Medium', origin: 'Bharat Cable Kolkata (WB)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Low-phosphorus PB-5 for Tata Power 765kV OLTC transition contact assembly &#8594; 5% Sn &#8594; &#8377;420Cr for 95 tonnes &#8594; India &#8377;2,800Cr PB contact &#8594; Tata 40 transformers &#8594; 450 MPa &#8594; &#8594; Contact &#8594; &#8594; C5100 &#8594; &#8594; Power' },
  { id: 'PBR-0006', batchNo: 'PBR-B2406', city: 'Coimbatore', manufacturer: 'VGP Marine', pbGrade: 'PB-Navy ABRC3', application: 'GRSE Frigate Propeller Shaft Bearing', purityPercent: 98.2, tensileStrengthMpa: 640, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'VGP Marine Chennai (TN)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Naval-grade ABRC3 phosphor bronze for GRSE Nilgiri-class frigate propeller shaft tail shaft bearing &#8594; Navy spec &#8594; &#8377;620Cr for 150 tonnes &#8594; India &#8377;4,600Cr PB naval &#8594; GRSE 7 frigates &#8594; 640 MPa &#8594; &#8594; Bush &#8594; &#8594; ABRC3 &#8594; &#8594; Naval' },
  { id: 'PBR-0007', batchNo: 'PBR-B2407', city: 'Pune', manufacturer: 'Bharat Forge', pbGrade: 'PB-Auto C89836', application: 'Bajaj Auto Engine Valve Guide', purityPercent: 98.6, tensileStrengthMpa: 380, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Bharat Forge Pune (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Automotive PB valve guide bronze for Bajaj Pulsar 400cc engine intake and exhaust valve guide &#8594; 3% Sn &#8594; &#8377;340Cr for 60 tonnes &#8594; India &#8377;1,800Cr PB guide &#8594; Bajaj 5M engines &#8594; 380 MPa &#8594; &#8594; Guide &#8594; &#8594; C89836 &#8594; &#8594; Auto' },
  { id: 'PBR-0008', batchNo: 'PBR-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Copper', pbGrade: 'PB-Textile C5100', application: 'Welspun Textile Loom Heddle', purityPercent: 97.8, tensileStrengthMpa: 420, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Copper Jodhpur (RJ)', destination: 'Welspun Vapi (GJ)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'PB-5 textile-grade phosphor bronze wire for Welspun loom heddle spring and eyelet &#8594; 5% Sn &#8594; &#8377;280Cr for 40 tonnes &#8594; India &#8377;1,200Cr PB textile &#8594; Welspun 2K looms &#8594; 420 MPa &#8594; &#8594; Wire &#8594; &#8594; C5100 &#8594; &#8594; Textile' },
  { id: 'PBR-0009', batchNo: 'PBR-B2409', city: 'Guwahati', manufacturer: 'Assam Copper', pbGrade: 'PB-Telecom C5210', application: 'Jio Fiber Optic Connector Shell', purityPercent: 99.0, tensileStrengthMpa: 560, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Assam Copper Silchar (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'C5210 phosphor bronze shell for Reliance Jio FTTH LC fiber optic connector &#8594; 8% Sn &#8594; &#8377;520Cr for 110 tonnes &#8594; India &#8377;3,600Cr PB telecom &#8594; Jio 50M connectors &#8594; 560 MPa &#8594; &#8594; Shell &#8594; &#8594; C5210 &#8594; &#8594; Telecom' },
  { id: 'PBR-0010', batchNo: 'PBR-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Metal', pbGrade: 'PB-Aerospace C5210', application: 'ISRO Satellite Solar Panel Hinge', purityPercent: 99.6, tensileStrengthMpa: 680, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Metal Ahmedabad (GJ)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Ultra-high reliability PB-8 for ISRO GSAT series solar array deployment hinge pin and torsion spring &#8594; 8% Sn &#8594; &#8377;860Cr for 35 tonnes &#8594; India &#8377;6,800Cr PB space &#8594; ISRO 18 satellites &#8594; 680 MPa &#8594; &#8594; Pin &#8594; &#8594; C5210 &#8594; &#8594; Space' },
  { id: 'PBR-0011', batchNo: 'PBR-B2411', city: 'Lucknow', manufacturer: 'UP Copper Corp', pbGrade: 'PB-Medical C5191', application: 'Trivitron MRI Gradient Coil', purityPercent: 99.3, tensileStrengthMpa: 500, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'UP Copper Lucknow (UP)', destination: 'Trivitron Chennai (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Medical-grade phosphor bronze for Trivitron 3T MRI gradient coil formers and RF shielding &#8594; 6% Sn &#8594; &#8377;480Cr for 25 tonnes &#8594; India &#8377;2,400Cr PB medical &#8594; Trivitron 200 scanners &#8594; 500 MPa &#8594; &#8594; Foil &#8594; &#8594; C5191 &#8594; &#8594; Medical' },
  { id: 'PBR-0012', batchNo: 'PBR-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Copper Works', pbGrade: 'PB-Submarine C5210', application: 'GRSE Submarine Sonar Dome', purityPercent: 99.4, tensileStrengthMpa: 640, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Copper Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Submarine-grade phosphor bronze for GRSE Project 75I submarine sonar dome acoustic window frame &#8594; 8% Sn &#8594; &#8377;940Cr for 90 tonnes &#8597; India &#8377;7,200Cr PB submarine &#8594; GRSE 6 submarines &#8594; 640 MPa &#8594; &#8594; Plate &#8594; &#8594; C5210 &#8594; &#8594; Naval' },
  { id: 'PBR-0013', batchNo: 'PBR-B2413', city: 'Bhopal', manufacturer: 'BHEL R&D', pbGrade: 'PB-Turbine C5240', application: 'BHEL Steam Turbine Blade Root', purityPercent: 99.1, tensileStrengthMpa: 620, investmentCr: 720, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'High-strength PB-10 for BHEL 660MW steam turbine blade root tenon and shroud &#8594; 10% Sn &#8594; &#8377;720Cr for 140 tonnes &#8594; India &#8377;5,200Cr PB turbine &#8594; BHEL 30 turbines &#8594; 620 MPa &#8594; &#8594; Block &#8594; &#8594; C5240 &#8594; &#8594; Power' },
  { id: 'PBR-0014', batchNo: 'PBR-B2414', city: 'Rourkela', manufacturer: 'SAIL Copper Div', pbGrade: 'PB-Welding C5100', application: 'Adani Gas Pipeline Valve', purityPercent: 98.4, tensileStrengthMpa: 440, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Adani Hazira (GJ)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Welding-grade phosphor bronze for Adani natural gas pipeline ball valve seat and seal ring &#8594; 5% Sn &#8594; &#8377;360Cr for 75 tonnes &#8594; India &#8377;2,200Cr PB pipeline &#8594; Adani 4K valves &#8594; 440 MPa &#8594; &#8594; Ring &#8594; &#8594; C5100 &#8594; &#8594; Oil &amp; Gas' },
];

export default function PhosphorBronzeLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'registry', label: 'Registry', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: Zap },
    { id: 'insights', label: 'Insights', icon: Zap },
  ];

  const filteredRecords = useMemo(() => {
    return phosphorBronzeRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pbGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    phosphorBronzeRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = phosphorBronzeRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = phosphorBronzeRecords.reduce((s: number, r) => s + r.purityPercent, 0) / phosphorBronzeRecords.length;
    const delayed = phosphorBronzeRecords.filter((r) => r.status === 'Delayed').length;
    const critical = phosphorBronzeRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#d97706';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Phosphor Bronze Logistics" description="Indian phosphor bronze (Cu-Sn-P) spring, bearing, connector, marine and defense supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / phosphorBronzeRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = phosphorBronzeRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {phosphorBronzeRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.pbGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.pbGrade}</span></div>
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {phosphorBronzeRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; phosphorBronzeRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = phosphorBronzeRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; phosphorBronzeRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; phosphorBronzeRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / phosphorBronzeRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Aerospace &amp; Defense Demand</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas Mk2 landing gear + ISRO satellite hinge + DRDO radar connector driving &#8594; &#8377;2,280Cr combined &#8594; highest priority segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Naval Submarine Programme</div><div className="text-xs text-muted-foreground mt-1">GRSE Project 75I sonar dome + Nilgiri-class propeller shaft bearing &#8594; &#8377;1,560Cr combined &#8594; critical naval build</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Steel &amp; Power Infrastructure</div><div className="text-xs text-muted-foreground mt-1">SAIL caster bearing + BHEL turbine root + Tata Power OLTC &#8594; &#8377;1,620Cr combined &#8594; heavy industrial cycle</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">PBR-B2412 GRSE submarine sonar dome delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I timeline at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 phosphor bronze grades spanning aerospace, naval, steel, power, telecom, medical and automotive &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Critical Priority: 5 Records</div><div className="text-xs text-muted-foreground mt-1">HAL landing gear &#8594; BEL radar &#8594; GRSE frigate &#8594; ISRO satellite &#8594; GRSE submarine &#8594; national security chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL lead defense demand &#8594; Sterlite &#8594; Hindustan Copper &#8594; Bharat Cable drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Regional Concentration</div><div className="text-xs text-muted-foreground mt-1">South zone dominates with Chennai &#8594; Bengaluru &#8594; Coimbatore &#8594; Hyderabad supply &#8594; West zone Pune emerging</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
