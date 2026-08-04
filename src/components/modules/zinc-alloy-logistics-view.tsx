"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Shield } from 'lucide-react';

interface ZincAlloyRecord {
  id: string; batchNo: string; city: string; manufacturer: string; znGrade: string;
  application: string; purityPercent: number; hardnessHH: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const zincAlloyRecords: ZincAlloyRecord[] = [
  { id: 'ZNA-0001', batchNo: 'ZNA-B2401', city: 'Mumbai', manufacturer: 'Hindustan Zinc', znGrade: 'ZA-27 Al27Cu2', application: 'Tata Motors Nexon Die Cast Block', purityPercent: 99.1, hardnessHH: 105, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Zinc Udaipur (RJ)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'ZA-27 zinc-aluminium die-casting alloy for Tata Motors Nexon engine block and transmission case &#8594; 27% Al &#8594; &#8377;720Cr for 8,000 tonnes &#8594; India &#8377;4,800Cr ZA die-cast &#8594; Tata 400K units &#8594; 105 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA27 &#8594; &#8594; Auto' },
  { id: 'ZNA-0002', batchNo: 'ZNA-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', znGrade: 'ZA-12 Naval Grade', application: 'BEL Submarine Sonar Housing', purityPercent: 99.4, hardnessHH: 92, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'Hindustan Zinc Chittorgarh (RJ)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'ZA-12 naval-grade zinc alloy for BEL Project 75I submarine sonar transducer pressure housing &#8594; 12% Al &#8594; &#8377;860Cr for 600 tonnes &#8594; India &#8377;6,200Cr ZA naval &#8594; BEL 6 submarines &#8594; 92 HB &#8594; &#8594; Casting &#8594; &#8594; ZA12 &#8594; &#8594; Naval' },
  { id: 'ZNA-0003', batchNo: 'ZNA-B2403', city: 'Chennai', manufacturer: 'Sterlite Zinc', znGrade: 'Zn-99.99 SHG', application: 'JSW Steel Galvanized Coil', purityPercent: 99.99, hardnessHH: 45, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Sterlite Zinc Hyderabad (TG)', destination: 'JSW Steel Salem (TN)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Special high-grade zinc for JSW Steel continuous galvanizing line hot-dip GI coil &#8594; 99.99% Zn &#8594; &#8377;580Cr for 25,000 tonnes &#8594; India &#8377;3,600Cr SHG &#8594; JSW 6 CGLs &#8594; 45 HB &#8594; &#8594; Ingot &#8594; &#8594; SHG &#8594; &#8594; Steel' },
  { id: 'ZNA-0004', batchNo: 'ZNA-B2404', city: 'Hyderabad', manufacturer: 'Hyderabad Zinc', znGrade: 'ZA-8 Al8Cu1', application: 'Mahindra XUV700 Die Cast Seat', purityPercent: 98.8, hardnessHH: 88, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Hyderabad Zinc Hyderabad (TG)', destination: 'Mahindra Nagpur (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'ZA-8 zinc-aluminium alloy for Mahindra XUV700 seat frame and instrument panel structural casting &#8594; 8% Al &#8594; &#8377;420Cr for 4,000 tonnes &#8594; India &#8377;2,800Cr ZA seat &#8594; Mahindra 200K units &#8594; 88 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA8 &#8594; &#8594; Auto' },
  { id: 'ZNA-0005', batchNo: 'ZNA-B2405', city: 'Kolkata', manufacturer: 'Bharat Zinc', znGrade: 'Zn-5 Al-MM', application: 'Godrej Lock Die Cast Body', purityPercent: 99.0, hardnessHH: 80, investmentCr: 280, status: 'In Transit', priority: 'Medium', origin: 'Bharat Zinc Kolkata (WB)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Zinc-alloy die-casting for Godrej ultra-lock precision lock body and cylinder housing &#8594; 5% Al &#8594; &#8377;280Cr for 1,200 tonnes &#8594; India &#8377;1,600Cr ZA lock &#8594; Godrej 20M locks &#8594; 80 HB &#8594; &#8594; Casting &#8594; &#8594; Zamak5 &#8594; &#8594; Hardware' },
  { id: 'ZNA-0006', batchNo: 'ZNA-B2406', city: 'Coimbatore', manufacturer: 'TN Zinc Works', znGrade: 'Zn-Ag Battery', application: 'Exide Industries Zn-Ag Cell', purityPercent: 99.6, hardnessHH: 42, investmentCr: 540, status: 'Delivered', priority: 'High', origin: 'TN Zinc Works Hosur (TN)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Zinc-silver alloy for Exide Industries zinc-silver oxide button cell and military reserve battery &#8594; 99.6% Zn &#8594; &#8377;540Cr for 400 tonnes &#8594; India &#8377;3,400Cr Zn battery &#8594; Exide 50M cells &#8594; 42 HB &#8594; &#8594; Powder &#8594; &#8594; ZnAg &#8594; &#8594; Battery' },
  { id: 'ZNA-0007', batchNo: 'ZNA-B2407', city: 'Pune', manufacturer: 'Bajaj Zinc Div', znGrade: 'Zn-Cu Brass Ingot', application: 'Bajaj Auto Wheel Rim', purityPercent: 98.5, hardnessHH: 75, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Bajaj Zinc Chakan (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Zinc-copper brass alloy ingot for Bajaj Pulsar and Dominar motorcycle spoked wheel rim pressing &#8594; 5% Cu &#8594; &#8377;340Cr for 3,000 tonnes &#8594; India &#8377;1,800Cr Zn brass &#8594; Bajaj 8M wheels &#8594; 75 HB &#8594; &#8594; Ingot &#8594; &#8594; ZnCu &#8594; &#8594; Auto' },
  { id: 'ZNA-0008', batchNo: 'ZNA-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Zinc', znGrade: 'ZnO-Pharma Grade', application: 'Sun Pharma Zinc Tablet', purityPercent: 99.8, hardnessHH: 38, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Zinc Jaipur (RJ)', destination: 'Sun Pharma Vadodara (GJ)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Pharmaceutical-grade zinc oxide for Sun Pharma zinc supplement and pediatric syrup &#8594; USP grade &#8594; &#8377;380Cr for 2,500 tonnes &#8594; India &#8377;2,000Cr ZnO pharma &#8594; Sun Pharma 800M tabs &#8594; 38 HB &#8594; &#8594; Powder &#8594; &#8594; ZnO &#8594; &#8594; Pharma' },
  { id: 'ZNA-0009', batchNo: 'ZNA-B2409', city: 'Guwahati', manufacturer: 'Assam Zinc', znGrade: 'Zn-97% Galv', application: 'Tata Steel Galvanizing Bath', purityPercent: 97.5, hardnessHH: 40, investmentCr: 460, status: 'In Transit', priority: 'High', origin: 'Assam Zinc Silchar (AS)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: '97% zinc for Tata Steel batch galvanizing bath structural steel and pipe coating &#8594; 97% Zn &#8594; &#8377;460Cr for 18,000 tonnes &#8594; India &#8377;2,600Cr Zn galv &#8594; Tata 4 baths &#8594; 40 HB &#8594; &#8594; Ingot &#8594; &#8594; CGG &#8594; &#8594; Steel' },
  { id: 'ZNA-0010', batchNo: 'ZNA-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Zinc Corp', znGrade: 'Zn-Ni Plating', application: 'Bharat Forge Crankshaft', purityPercent: 99.3, hardnessHH: 48, investmentCr: 620, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Zinc Ahmedabad (GJ)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Zinc-nickel alloy for Bharat Forge crankshaft electroplating anode and barrel plating &#8594; 12% Ni &#8594; &#8377;620Cr for 800 tonnes &#8594; India &#8377;4,400Cr Zn-Ni &#8594; Bharat Forge 5M shafts &#8594; 48 HB &#8594; &#8594; Anode &#8594; &#8594; ZnNi &#8594; &#8594; Auto' },
  { id: 'ZNA-0011', batchNo: 'ZNA-B2411', city: 'Lucknow', manufacturer: 'UP Zinc Industries', znGrade: 'Zn-Ti Corrosion', application: 'Reliance Pipeline Internal', purityPercent: 99.2, hardnessHH: 55, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'UP Zinc Lucknow (UP)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Zinc-titanium alloy for Reliance Jamnagar refinery pipeline internal corrosion inhibitor anode &#8594; 0.1% Ti &#8594; &#8377;480Cr for 600 tonnes &#8594; India &#8377;2,800Cr Zn sacrificial &#8594; Reliance 200 km &#8594; 55 HB &#8594; &#8594; Anode &#8594; &#8594; ZnTi &#8594; &#8594; Oil &amp; Gas' },
  { id: 'ZNA-0012', batchNo: 'ZNA-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Zinc Works', znGrade: 'ZA-43 Al43', application: 'GRSE Corvette Deck Fitting', purityPercent: 99.0, hardnessHH: 110, investmentCr: 740, status: 'Delayed', priority: 'Critical', origin: 'Vizag Zinc Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'ZA-43 high-strength zinc alloy for GRSE ASW corvette deck fitting and mast bracket casting &#8594; 43% Al &#8594; &#8377;740Cr for 900 tonnes &#8597; India &#8377;5,200Cr ZA naval &#8594; GRSE 7 vessels &#8594; 110 HB &#8594; &#8594; Casting &#8594; &#8594; ZA43 &#8594; &#8594; Naval' },
  { id: 'ZNA-0013', batchNo: 'ZNA-B2413', city: 'Bhopal', manufacturer: 'BHEL Zinc Div', znGrade: 'Zn-Dust Rotor', application: 'BHEL Wind Turbine Generator', purityPercent: 99.5, hardnessHH: 35, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Zinc dust for BHEL wind turbine generator rotor field coil zinc oxide varistor surge protection &#8594; 99.5% Zn &#8594; &#8377;520Cr for 1,000 tonnes &#8594; India &#8377;3,200Cr Zn varistor &#8594; BHEL 2K turbines &#8594; 35 HB &#8594; &#8594; Dust &#8594; &#8594; ZnD &#8594; &#8594; Power' },
  { id: 'ZNA-0014', batchNo: 'ZNA-B2414', city: 'Rourkela', manufacturer: 'SAIL Zinc', znGrade: 'Zn-95% Thermal', application: 'Hindalco Aluminium Smelter', purityPercent: 95.8, hardnessHH: 42, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Hindalco Hirakud (OD)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: '95% zinc for Hindalco aluminium smelter cell anode zinc-aluminium sacrificial cathode lining &#8594; 95% Zn &#8594; &#8377;360Cr for 12,000 tonnes &#8594; India &#8377;1,400Cr Zn smelter &#8594; Hindalco 400 pots &#8594; 42 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA95 &#8594; &#8594; Metals' },
];

export default function ZincAlloyLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'registry', label: 'Registry', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: Shield },
    { id: 'insights', label: 'Insights', icon: Shield },
  ];

  const filteredRecords = useMemo(() => {
    return zincAlloyRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.znGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    zincAlloyRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = zincAlloyRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = zincAlloyRecords.reduce((s: number, r) => s + r.purityPercent, 0) / zincAlloyRecords.length;
    const delayed = zincAlloyRecords.filter((r) => r.status === 'Delayed').length;
    const critical = zincAlloyRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#16a34a';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Zinc Alloy Logistics" description="Indian zinc alloy (Zn-Al-Cu) die-casting, galvanizing, battery and automotive supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-green-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / zincAlloyRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = zincAlloyRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {zincAlloyRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.znGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.znGrade}</span></div>
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {zincAlloyRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; zincAlloyRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = zincAlloyRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; zincAlloyRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; zincAlloyRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / zincAlloyRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Automotive Die-Casting Boom</div><div className="text-xs text-muted-foreground mt-1">Tata Nexon + Mahindra XUV700 + Bajaj wheel driving &#8594; &#8377;1,480Cr combined &#8594; India EV transition accelerates ZA demand</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Naval Defence Programme</div><div className="text-xs text-muted-foreground mt-1">BEL submarine sonar + GRSE corvette deck fitting &#8594; &#8377;1,600Cr combined &#8594; Aatmanirbhar naval build</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Galvanizing &amp; Steel</div><div className="text-xs text-muted-foreground mt-1">JSW CGL + Tata galvanizing bath &#8594; &#8377;1,040Cr combined &#8594; infra build drives GI demand</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">ZNA-B2412 GRSE corvette deck fitting delayed &#8594; monsoon Visakhapatnam port congestion &#8594; ASW corvette delivery at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 zinc alloy grades spanning auto, naval, steel, pharma, battery, power and oil &amp; gas &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">Tata Motors die-cast &#8594; BEL submarine &#8594; Bharat Forge plating &#8594; GRSE corvette &#8594; high-value chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Hindustan Zinc dominates &#8594; Sterlite Zinc &#8594; BHEL Zinc &#8594; SAIL Zinc &#8594; regional smelters emerging</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Hindustan Zinc Monopoly</div><div className="text-xs text-muted-foreground mt-1">Vedanta Hindustan Zinc controls 95% Indian primary zinc production &#8594; Udaipur + Chittorgarh mines &#8594; strategic supply chain risk</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
