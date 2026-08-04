"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Gem } from 'lucide-react';

interface NickelChromiumRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const nickelchromiumRecords: NickelChromiumRecord[] = [
  { id: 'NCR-0001', batchNo: 'NCR-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'NiCr 80/20 Heating', application: 'SAIL Bilai Annealing Furnace', purityPercent: 99.5, specProp: 1080, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'NiCr 80/20 heating element for SAIL Bhilai annealing furnace &amp;#8594; 1080 degC max &amp;#8594; &amp;#8377;860Cr for 80 tonnes &amp;#8594; India &amp;#8377;6,200Cr NiCr heating &amp;#8594; SAIL 8 furnaces &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; NiCr8020 &amp;#8594; &amp;#8594; Steel' },
  { id: 'NCR-0002', batchNo: 'NCR-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'NiCr 60/15 Superalloy', application: 'BEL Tejas Mk2 Afterburner', purityPercent: 99.2, specProp: 1350, investmentCr: 820, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'NiCr 60/15 superalloy for BEL Tejas Mk2 afterburner liner &amp;#8594; 1350 degC max &amp;#8594; &amp;#8377;820Cr for 60 tonnes &amp;#8594; India &amp;#8377;5,800Cr NiCr aero &amp;#8594; BEL 40 aircraft &amp;#8594; 99.2% purity &amp;#8594; &amp;#8594; Sheet &amp;#8594; &amp;#8594; NiCrSup &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'NCR-0003', batchNo: 'NCR-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'NiCr 70/30 Thermocouple', application: 'JSW Steel Continuous Caster', purityPercent: 99.8, specProp: 1300, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'NiCr 70/30 Type K thermocouple for JSW continuous caster molten steel temperature &amp;#8594; 1300 degC max &amp;#8594; &amp;#8377;940Cr for 30 tonnes &amp;#8594; India &amp;#8377;7,600Cr NiCr TC &amp;#8594; JSW 12 casters &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; NiCrTC &amp;#8594; &amp;#8594; Steel' },
  { id: 'NCR-0004', batchNo: 'NCR-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'NiCr 50/50 Resistance', application: 'Bharat Forge Forge Heater', purityPercent: 98.5, specProp: 1200, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'NiCr 50/50 resistance wire for Bharat Forge forging induction heater element &amp;#8594; 1200 degC max &amp;#8594; &amp;#8377;520Cr for 100 tonnes &amp;#8594; India &amp;#8377;3,600Cr NiCr forge &amp;#8594; Bharat Forge 5M forgings &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Ribbon &amp;#8594; &amp;#8594; NiCr5050 &amp;#8594; &amp;#8594; Automotive' },
  { id: 'NCR-0005', batchNo: 'NCR-B2405', city: 'Kolkata', manufacturer: 'Shyam Alloys', grade: 'NiCr 80/20 Oven', application: 'L&amp;T Warship Galley Oven', purityPercent: 99.0, specProp: 1100, investmentCr: 640, status: 'In Transit', priority: 'High', origin: 'Shyam Alloys Kolkata (WB)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'NiCr 80/20 oven element for L&amp;amp;T warship galley oven heating coil &amp;#8594; 1100 degC max &amp;#8594; &amp;#8377;640Cr for 50 tonnes &amp;#8594; India &amp;#8377;4,400Cr NiCr naval &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Coil &amp;#8594; &amp;#8594; NiCrNav &amp;#8594; &amp;#8594; Naval' },
  { id: 'NCR-0006', batchNo: 'NCR-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'NiCr 60/20 Turbine', application: 'BHEL 800MW GT Combustor', purityPercent: 99.4, specProp: 1400, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'NiCr 60/20 gas turbine for BHEL 800MW GT combustor liner &amp;#8594; 1400 degC max &amp;#8594; &amp;#8377;780Cr for 55 tonnes &amp;#8594; India &amp;#8377;5,200Cr NiCr GT &amp;#8594; BHEL 20 GTs &amp;#8594; 99.4% purity &amp;#8594; &amp;#8594; Bar &amp;#8594; &amp;#8594; NiCrGT &amp;#8594; &amp;#8594; Power' },
  { id: 'NCR-0007', batchNo: 'NCR-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'NiCr 80/20 EV Heater', application: 'Mahindra XUV400 PTC Heater', purityPercent: 99.0, specProp: 1080, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'NiCr 80/20 heating wire for Mahindra XUV400 EV PTC cabin heater element &amp;#8594; 1080 degC &amp;#8594; &amp;#8377;440Cr for 40 tonnes &amp;#8594; India &amp;#8377;3,000Cr NiCr EV &amp;#8594; Mahindra 50K vehicles &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; NiCrEV &amp;#8594; &amp;#8594; Automotive' },
  { id: 'NCR-0008', batchNo: 'NCR-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Alloys', grade: 'NiCr 90/10 Spark Plug', application: 'Bajaj Auto Ignition Electrode', purityPercent: 98.8, specProp: 1050, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Alloys Jodhpur (RJ)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'NiCr 90/10 spark plug electrode for Bajaj Auto motorcycle ignition &amp;#8594; 1050 degC &amp;#8594; &amp;#8377;380Cr for 30 tonnes &amp;#8594; India &amp;#8377;2,600Cr NiCr ignition &amp;#8594; Bajaj 5M bikes &amp;#8594; 98.8% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; NiCrSpark &amp;#8594; &amp;#8594; Automotive' },
  { id: 'NCR-0009', batchNo: 'NCR-B2409', city: 'Guwahati', manufacturer: 'Assam Alloys', grade: 'NiCr 70/30 Rail Weld', application: 'Indian Railways Thermit Weld', purityPercent: 98.0, specProp: 1250, investmentCr: 480, status: 'In Transit', priority: 'High', origin: 'Assam Alloys Tezpur (AS)', destination: 'Indian Railways Delhi (DL)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'NiCr 70/30 rail thermocouple for Indian Railways thermite weld temperature monitoring &amp;#8594; 1250 degC &amp;#8594; &amp;#8377;480Cr for 50 tonnes &amp;#8594; India &amp;#8377;3,200Cr NiCr rail &amp;#8594; IR 50K welds &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; NiCrRail &amp;#8594; &amp;#8594; Rail' },
  { id: 'NCR-0010', batchNo: 'NCR-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Alloys', grade: 'NiCr 80/20 Nuclear', application: 'IGCAR PFBR Heater', purityPercent: 99.9, specProp: 1150, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Alloys Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'NiCr 80/20 nuclear-grade for IGCAR PFBR secondary sodium heater &amp;#8594; 1150 degC &amp;#8594; &amp;#8377;900Cr for 35 tonnes &amp;#8594; India &amp;#8377;7,400Cr NiCr nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Tube &amp;#8594; &amp;#8594; NiCrNuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'NCR-0011', batchNo: 'NCR-B2411', city: 'Lucknow', manufacturer: 'UP Alloys', grade: 'NiCr 60/15 Glazing', application: 'RAK Ceramics Glass Kiln', purityPercent: 97.5, specProp: 1300, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'UP Alloys Kanpur (UP)', destination: 'RAK Ceramics Delhi (DL)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'NiCr 60/15 glazing kiln for RAK Ceramics glass firing kiln element &amp;#8594; 1300 degC &amp;#8594; &amp;#8377;360Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,400Cr NiCr ceramic &amp;#8594; RAK 10M sqm &amp;#8594; 97.5% purity &amp;#8594; &amp;#8594; Rod &amp;#8594; &amp;#8594; NiCrGlaz &amp;#8594; &amp;#8594; Ceramics' },
  { id: 'NCR-0012', batchNo: 'NCR-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Alloys', grade: 'NiCr 60/20 Submarine', application: 'GRSE Project 75I Periscope', purityPercent: 99.6, specProp: 1350, investmentCr: 960, status: 'Delayed', priority: 'Critical', origin: 'Vizag Alloys Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'NiCr 60/20 submarine-grade for GRSE Project 75I periscope mast heating de-icing &amp;#8597; 1350 degC &amp;#8597; &amp;#8377;960Cr for 25 tonnes &amp;#8597; India &amp;#8377;7,800Cr NiCr submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.6% purity &amp;#8597; &amp;#8594; Strip &amp;#8597; &amp;#8594; NiCrSub &amp;#8597; &amp;#8594; Naval' },
  { id: 'NCR-0013', batchNo: 'NCR-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'NiCr 70/30 Missile', application: 'DRDO BrahMos Seeker Thermal', purityPercent: 99.3, specProp: 1300, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'NiCr 70/30 missile-grade for DRDO BrahMos Mk2 IR seeker thermal shield &amp;#8594; 1300 degC &amp;#8594; &amp;#8377;880Cr for 40 tonnes &amp;#8594; India &amp;#8377;6,400Cr NiCr missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.3% purity &amp;#8594; &amp;#8594; Foil &amp;#8594; &amp;#8594; NiCrMsl &amp;#8594; &amp;#8594; Defense' },
  { id: 'NCR-0014', batchNo: 'NCR-B2414', city: 'Rourkela', manufacturer: 'SAIL Alloys', grade: 'NiCr 50/50 General', application: 'SAIL Rourkela Boiler Tube', purityPercent: 97.0, specProp: 1100, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'NiCr 50/50 boiler tube for SAIL Rourkela power plant superheater tube &amp;#8594; 1100 degC &amp;#8594; &amp;#8377;320Cr for 120 tonnes &amp;#8594; India &amp;#8377;2,200Cr NiCr boiler &amp;#8594; SAIL 4 boilers &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Tube &amp;#8594; &amp;#8594; NiCrGen &amp;#8594; &amp;#8594; Power' },
];

export default function NickelChromiumLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Gem },
    { id: 'registry', label: 'Registry', icon: Gem },
    { id: 'analytics', label: 'Analytics', icon: Gem },
    { id: 'insights', label: 'Insights', icon: Gem },
  ];

  const filteredRecords = useMemo(() => {
    return nickelchromiumRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    nickelchromiumRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = nickelchromiumRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = nickelchromiumRecords.reduce((s: number, r) => s + r.purityPercent, 0) / nickelchromiumRecords.length;
    const delayed = nickelchromiumRecords.filter((r) => r.status === 'Delayed').length;
    const critical = nickelchromiumRecords.filter((r) => r.priority === 'Critical').length;
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
      <PageHeader title="Nickel Chromium Logistics" description="Indian nickel chromium logistics supply chain tracking across 14 grades spanning aerospace, defense, power, automotive, nuclear and industrial sectors" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / nickelchromiumRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = nickelchromiumRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {nickelchromiumRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.grade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Max Temp (degC)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {nickelchromiumRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; nickelchromiumRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = nickelchromiumRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; nickelchromiumRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; nickelchromiumRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / nickelchromiumRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Heating Element Dominance</div><div className="text-xs text-muted-foreground mt-1">SAIL furnace &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; &#8377;2,540Cr combined &#8594; highest volume segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Defense &amp; Aerospace</div><div className="text-xs text-muted-foreground mt-1">BEL Tejas afterburner &#8594; DRDO BrahMos seeker &#8594; GRSE submarine periscope &#8594; &#8377;2,660Cr combined &#8594; strategic assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Precision Thermocouple</div><div className="text-xs text-muted-foreground mt-1">JSW caster &#8594; Indian Railways weld &#8594; &#8377;1,420Cr combined &#8594; temperature measurement critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">NCR-B2412 GRSE submarine periscope de-icing delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 NiCr grades spanning heating, aerospace, thermocouple, forge, naval, GT, EV, ignition, rail, nuclear, ceramic, missile &#8594; avg purity 99.02%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">SAIL &#8594; BEL &#8594; JSW &#8594; BHEL &#8594; IGCAR &#8594; GRSE &#8594; DRDO &#8594; Mahindra</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Bharat Forge &#8594; Shyam &#8594; Gujarat Alloys</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-rose-500 bg-rose-50/50"><div className="font-medium">Temp Spectrum</div><div className="text-xs text-muted-foreground mt-1">1050-1400 degC range &#8594; NiCr 60/20 turbine at 1400 &#8594; NiCr 90/10 spark plug at 1050 &#8594; grade critical to temperature</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
