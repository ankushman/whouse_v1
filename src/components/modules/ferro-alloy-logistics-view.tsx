"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Hammer } from 'lucide-react';

interface FerroAlloyRecord {
  id: string; batchNo: string; city: string; manufacturer: string; faGrade: string;
  application: string; purityPercent: number; carbonContent: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const ferroAlloyRecords: FerroAlloyRecord[] = [
  { id: 'FA-0001', batchNo: 'FA-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', faGrade: 'FeCr HC 65/6', application: 'SAIL Bhilai Blast Furnace Charge', purityPercent: 98.5, carbonContent: 6.2, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'High-carbon ferro chrome 65/6 for SAIL Bhilai basic oxygen furnace stainless steel melting charge &#8594; 65% Cr &#8594; &#8377;780Cr for 8,000 tonnes &#8594; India &#8377;4,800Cr FeCr HC &#8594; SAIL 6 BOF &#8594; 6.2% C &#8594; &#8594; Lump &#8594; &#8594; HC65/6 &#8594; &#8594; Steel' },
  { id: 'FA-0002', batchNo: 'FA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', faGrade: 'FeMo 70 Grade', application: 'BEL LCA Mk1A Undercarriage', purityPercent: 99.2, carbonContent: 0.12, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'IMFA Bhubaneswar (OD)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Ferro molybdenum 70% for HAL Tejas LCA Mk1A landing gear and undercarriage forging alloy &#8594; 70% Mo &#8594; &#8377;860Cr for 600 tonnes &#8594; India &#8377;6,200Cr FeMo &#8594; BEL 40 aircraft &#8594; 0.12% C &#8594; &#8594; Lump &#8594; &#8594; FeMo70 &#8594; &#8594; Aerospace' },
  { id: 'FA-0003', batchNo: 'FA-B2403', city: 'Chennai', manufacturer: 'Tata Steel', faGrade: 'FeMn HC 75/7', application: 'JSW Steel Vijayanagar BOF', purityPercent: 97.8, carbonContent: 7.1, investmentCr: 620, status: 'Delivered', priority: 'High', origin: 'Tata Steel Ferro Alloys Jharkhand (JH)', destination: 'JSW Steel Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'High-carbon ferro manganese 75/7 for JSW Steel Vijayanagar blast furnace deoxidizer and alloying &#8594; 75% Mn &#8594; &#8377;620Cr for 12,000 tonnes &#8594; India &#8377;3,800Cr FeMn HC &#8594; JSW 4 BOF &#8594; 7.1% C &#8594; &#8594; Lump &#8594; &#8594; HC75/7 &#8594; &#8594; Steel' },
  { id: 'FA-0004', batchNo: 'FA-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', faGrade: 'FeSi 75 Grade', application: 'Bharat Forge Crankshaft Ingot', purityPercent: 98.4, carbonContent: 0.15, investmentCr: 440, status: 'Delivered', priority: 'High', origin: 'Ferro Alloys Corp Bangalore (KA)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Ferro silicon 75% for Bharat Forge crankshaft and axle forging deoxidizer and inoculant &#8594; 75% Si &#8594; &#8377;440Cr for 4,000 tonnes &#8594; India &#8377;2,600Cr FeSi75 &#8594; Bharat Forge 5M shafts &#8594; 0.15% C &#8594; &#8594; Lump &#8594; &#8594; FeSi75 &#8594; &#8594; Auto' },
  { id: 'FA-0005', batchNo: 'FA-B2405', city: 'Kolkata', manufacturer: 'Shyam Ferro Alloys', faGrade: 'FeCr LC 70/0.05', application: 'Tata Power Transformer Core', purityPercent: 99.6, carbonContent: 0.04, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Shyam Ferro Raipur (CG)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Low-carbon ferro chrome 70/0.05 for Tata Power 765kV grain-oriented silicon steel core lamination &#8594; 70% Cr &#8594; &#8377;520Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr FeCr LC &#8594; Tata 40 transformers &#8594; 0.04% C &#8594; &#8594; Chip &#8594; &#8594; LC70/0.05 &#8594; &#8594; Power' },
  { id: 'FA-0006', batchNo: 'FA-B2406', city: 'Coimbatore', manufacturer: 'L&T Foundry', faGrade: 'FeW 80 Tungsten', application: 'L&T Warship Propeller Hub', purityPercent: 99.1, carbonContent: 0.08, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'Tungsten Alloys Hyderabad (TG)', destination: 'L&T Kattupalli (TN)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Ferro tungsten 80% for L&amp;T naval warship propeller hub high-speed steel and martensitic forging &#8594; 80% W &#8594; &#8377;680Cr for 500 tonnes &#8594; India &#8377;4,600Cr FeW &#8594; L&amp;T 12 warships &#8594; 0.08% C &#8594; &#8594; Lump &#8594; &#8594; FeW80 &#8594; &#8594; Naval' },
  { id: 'FA-0007', batchNo: 'FA-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', faGrade: 'FeV 50 Vanadium', application: 'Mahindra XUV400 EV Frame', purityPercent: 99.4, carbonContent: 0.1, investmentCr: 560, status: 'Delivered', priority: 'High', origin: 'Vanzar Alloys Vapi (GJ)', destination: 'Mahindra Nashik (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Ferro vanadium 50% for Mahindra XUV400 EV chassis frame high-strength low-alloy microalloyed steel &#8594; 50% V &#8594; &#8377;560Cr for 400 tonnes &#8594; India &#8377;3,400Cr FeV50 &#8594; Mahindra 80K frames &#8594; 0.1% C &#8594; &#8594; Lump &#8594; &#8594; FeV50 &#8594; &#8594; Auto' },
  { id: 'FA-0008', batchNo: 'FA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Ferro Alloys', faGrade: 'FeNi 20 Nickel', application: 'Godrej Appliance Motor', purityPercent: 98.8, carbonContent: 0.2, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Ferro Alloys Udaipur (RJ)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Ferro nickel 20% for Godrej washing machine motor lamination stainless steel rotor core &#8594; 20% Ni &#8594; &#8377;340Cr for 1,500 tonnes &#8594; India &#8377;2,000Cr FeNi20 &#8594; Godrej 5M motors &#8594; 0.2% C &#8594; &#8594; Lump &#8594; &#8594; FeNi20 &#8594; &#8594; Appliance' },
  { id: 'FA-0009', batchNo: 'FA-B2409', city: 'Guwahati', manufacturer: 'Assam Ferro Alloys', faGrade: 'FeNb 65 Niobium', application: 'Jio 5G Tower Girder', purityPercent: 99.3, carbonContent: 0.06, investmentCr: 480, status: 'In Transit', priority: 'High', origin: 'Assam Ferro Alloys Silchar (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Ferro niobium 65% for Reliance Jio 5G tower structural steel HSLA girder microalloying &#8594; 65% Nb &#8594; &#8377;480Cr for 300 tonnes &#8594; India &#8377;3,000Cr FeNb65 &#8594; Jio 100K towers &#8594; 0.06% C &#8594; &#8594; Lump &#8594; &#8594; FeNb65 &#8594; &#8594; Telecom' },
  { id: 'FA-0010', batchNo: 'FA-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Alloys', faGrade: 'FeSiMn 65/15', application: 'Bajaj Auto Chassis Rail', purityPercent: 98.6, carbonContent: 1.2, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Alloys Kutch (GJ)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Ferro silico manganese 65/15 for Bajaj Pulsar motorcycle chassis rail structural steel complex deoxidizer &#8594; 65% Mn &#8594; &#8377;420Cr for 6,000 tonnes &#8594; India &#8377;2,400Cr FeSiMn &#8594; Bajaj 8M rails &#8594; 1.2% C &#8594; &#8594; Lump &#8594; &#8594; SiMn65/15 &#8594; &#8594; Auto' },
  { id: 'FA-0011', batchNo: 'FA-B2411', city: 'Lucknow', manufacturer: 'UP Ferro Alloys', faGrade: 'FeTi 70 Titanium', application: 'Adani Pipeline Desulf', purityPercent: 99.0, carbonContent: 0.08, investmentCr: 540, status: 'Delivered', priority: 'Medium', origin: 'UP Ferro Alloys Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Ferro titanium 70% for Adani natural gas pipeline inner wall desulfurizer and inclusion modifier &#8594; 70% Ti &#8594; &#8377;540Cr for 800 tonnes &#8594; India &#8377;3,200Cr FeTi70 &#8594; Adani 200 km &#8594; 0.08% C &#8594; &#8594; Lump &#8594; &#8594; FeTi70 &#8594; &#8594; Oil &amp; Gas' },
  { id: 'FA-0012', batchNo: 'FA-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Ferro Alloys', faGrade: 'FeCr LC 70/0.03 Nuclear', application: 'GRSE Project 75I Hull Plate', purityPercent: 99.7, carbonContent: 0.02, investmentCr: 920, status: 'Delayed', priority: 'Critical', origin: 'Vizag Ferro Alloys Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Ultra-low carbon ferro chrome 70/0.03 for GRSE Project 75I submarine hull special steel nuclear-grade forging &#8594; 70% Cr &#8594; &#8377;920Cr for 450 tonnes &#8597; India &#8377;7,600Cr FeCr nuclear &#8594; GRSE 6 submarines &#8597; 0.02% C &#8597; &#8594; Lump &#8594; &#8594; LC70/0.03 &#8594; &#8594; Naval' },
  { id: 'FA-0013', batchNo: 'FA-B2413', city: 'Bhopal', manufacturer: 'BHEL Ferro Div', faGrade: 'FeMo 60 BHEL', application: 'BHEL 800MW GT Blade', purityPercent: 99.2, carbonContent: 0.1, investmentCr: 720, status: 'In Transit', priority: 'Critical', origin: 'IMFA Rayagada (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Ferro molybdenum 60% for BHEL 800MW gas turbine nickel superalloy single-crystal blade forging &#8594; 60% Mo &#8594; &#8377;720Cr for 400 tonnes &#8594; India &#8377;5,200Cr FeMo GT &#8594; BHEL 30 GTs &#8594; 0.1% C &#8594; &#8594; Lump &#8594; &#8594; FeMo60 &#8594; &#8594; Power' },
  { id: 'FA-0014', batchNo: 'FA-B2414', city: 'Rourkela', manufacturer: 'SAIL Ferro Alloys', faGrade: 'FeSi 45 Low Cost', application: 'Welspun Galvanized Pipe', purityPercent: 97.2, carbonContent: 0.2, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Welspun Vapi (GJ)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Ferro silicon 45% low-cost grade for Welspun galvanized steel pipe batch galvanizing silicon alloying &#8594; 45% Si &#8594; &#8377;320Cr for 5,000 tonnes &#8594; India &#8377;1,800Cr FeSi45 &#8594; Welspun 4K pipes &#8594; 0.2% C &#8594; &#8594; Lump &#8594; &#8594; FeSi45 &#8594; &#8594; Steel' },
];

export default function FerroAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Hammer },
    { id: 'registry', label: 'Registry', icon: Hammer },
    { id: 'analytics', label: 'Analytics', icon: Hammer },
    { id: 'insights', label: 'Insights', icon: Hammer },
  ];

  const filteredRecords = useMemo(() => {
    return ferroAlloyRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.faGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    ferroAlloyRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = ferroAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = ferroAlloyRecords.reduce((s: number, r) => s + r.purityPercent, 0) / ferroAlloyRecords.length;
    const delayed = ferroAlloyRecords.filter((r) => r.status === 'Delayed').length;
    const critical = ferroAlloyRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#e11d48';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Ferro Alloy Logistics" description="Indian ferro alloy (Fe-Cr, Fe-Mn, Fe-Si, Fe-Mo) steelmaking, foundry, welding and superalloy supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-rose-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-rose-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-rose-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-rose-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-rose-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-rose-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / ferroAlloyRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = ferroAlloyRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ferroAlloyRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.faGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.faGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Carbon:</span><span className="font-medium">{record.carbonContent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {ferroAlloyRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; ferroAlloyRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = ferroAlloyRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; ferroAlloyRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; ferroAlloyRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / ferroAlloyRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Steelmaking &amp; Infrastructure</div><div className="text-xs text-muted-foreground mt-1">SAIL BOF FeCr &#8594; JSW FeMn &#8594; Tata Steel FeSi driving &#8594; &#8377;2,020Cr combined &#8594; backbone of Indian steel</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Naval &amp; Defense Superalloys</div><div className="text-xs text-muted-foreground mt-1">GRSE submarine hull FeCr LC &#8594; L&amp;T warship propeller FeW &#8594; BHEL GT blade FeMo &#8594; &#8377;2,320Cr combined &#8594; strategic alloys</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Automotive &amp; EV Microalloying</div><div className="text-xs text-muted-foreground mt-1">Mahindra EV FeV &#8594; Bajaj FeSiMn &#8594; Bharat Forge FeSi &#8594; &#8594; &#8377;1,420Cr combined &#8594; lightweight vehicle push</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">FA-B2412 GRSE Project 75I hull plate delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine steel forging at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 ferro alloy grades spanning steel, power, naval, aerospace, EV, telecom, appliance and pipeline &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Critical Priority: 6 Records</div><div className="text-xs text-muted-foreground mt-1">SAIL BOF &#8594; BEL aircraft &#8594; L&amp;T warship &#8594; GRSE submarine &#8594; BHEL GT &#8594; DRDO missile-grade</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Tata Steel &#8594; MIDHANI &#8594; SAIL lead volume &#8594; IMFA &#8594; Shyam Ferro &#8594; Bharat Forge drive application-specific</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Import Dependency Alert</div><div className="text-xs text-muted-foreground mt-1">FeMo, FeV, FeNb, FeW heavily import-dependent &#8594; China/South Africa supply risk &#8594; Atmanirbhar ferro alloy push critical</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
