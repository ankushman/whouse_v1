"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Snowflake } from 'lucide-react';

interface ZirconiumFluorideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const zirconiumfluorideRecords: ZirconiumFluorideRecord[] = [
  { id: 'ZRF-0001', batchNo: 'ZRF-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'ZrF4 99.99% Optical Crystal', application: 'ISRO Chandrayaan-4 IR Lens', purityPercent: 99.99, specProp: 1.52, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'ZrF4 99.99% fluoride glass precursor for ISRO Chandrayaan-4 lunar IR camera zirconium fluoride optical lens &amp;#8594; nD 1.52 &amp;#8594; &amp;#8377;920Cr for 20 tonnes &amp;#8594; India &amp;#8377;6,800Cr ZrF4 optical &amp;#8594; ISRO 4 missions &amp;#8594; 99.99% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; ZrF4Opt &amp;#8594; &amp;#8594; Space' },
  { id: 'ZRF-0002', batchNo: 'ZRF-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'ZrF4 99.95% Laser Host', application: 'DRDO DIRCM IR Laser Window', purityPercent: 99.95, specProp: 1.51, investmentCr: 840, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'ZrF4 99.95% laser-grade for DRDO DIRCM infrared countermeasure laser window &amp;#8594; nD 1.51 &amp;#8594; &amp;#8377;840Cr for 25 tonnes &amp;#8594; India &amp;#8377;5,800Cr ZrF4 laser &amp;#8594; DRDO 100 systems &amp;#8594; 99.95% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; ZrF4Laser &amp;#8594; &amp;#8594; Defense' },
  { id: 'ZRF-0003', batchNo: 'ZRF-B2403', city: 'Chennai', manufacturer: 'Indian Rare Earths', grade: 'ZrF4 99.9% Fluorozirconate Glass', application: 'BEL AESA Radar IR Dome', purityPercent: 99.9, specProp: 1.5, investmentCr: 780, status: 'Delivered', priority: 'High', origin: 'IRE Alwaye (KL)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'ZrF4 99.9% fluorozirconate glass for BEL AESA radar IR-transparent radome dome &amp;#8594; nD 1.50 &amp;#8594; &amp;#8377;780Cr for 30 tonnes &amp;#8594; India &amp;#8377;5,400Cr ZrF4 radar &amp;#8594; BEL 12 radars &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Glass &amp;#8594; &amp;#8594; ZrF4Radar &amp;#8594; &amp;#8594; Defense' },
  { id: 'ZRF-0004', batchNo: 'ZRF-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'ZrF4 99.5% Weld Flux', application: 'L&amp;T Naval Hull Zirconia Weld', purityPercent: 99.5, specProp: 3.8, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'ZrF4 99.5% welding flux for L&amp;amp;T naval hull zirconia weld flux electrode coating &amp;#8594; 3.8 g/cm3 &amp;#8594; &amp;#8377;520Cr for 80 tonnes &amp;#8594; India &amp;#8377;3,600Cr ZrF4 weld &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Weld &amp;#8594; &amp;#8594; Naval' },
  { id: 'ZRF-0005', batchNo: 'ZRF-B2405', city: 'Kolkata', manufacturer: 'Tata Steel', grade: 'ZrF4 99% Steel Inclusion', application: 'JSW Steel Bearing Steel Pinning', purityPercent: 99.0, specProp: 4.6, investmentCr: 480, status: 'In Transit', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'ZrF4 99% steel inclusion modifier for JSW bearing steel zirconium inclusion shape control &amp;#8594; 4.6 g/cm3 &amp;#8594; &amp;#8377;480Cr for 60 tonnes &amp;#8594; India &amp;#8377;3,200Cr ZrF4 steel &amp;#8594; JSW 200K tonnes &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Inc &amp;#8594; &amp;#8594; Steel' },
  { id: 'ZRF-0006', batchNo: 'ZRF-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'ZrF4 99.9% Nuclear Coolant', application: 'IGCAR PFBR Molten Salt', purityPercent: 99.9, specProp: 4.6, investmentCr: 740, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'ZrF4 99.9% nuclear-grade for IGCAR PFBR advanced molten salt reactor coolant &amp;#8594; 4.6 g/cm3 &amp;#8594; &amp;#8377;740Cr for 40 tonnes &amp;#8594; India &amp;#8377;5,200Cr ZrF4 nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; ZrF4Cool &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'ZRF-0007', batchNo: 'ZRF-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'ZrF4 98% Ceramic Glaze', application: 'RAK Ceramics Opalescent Glaze', purityPercent: 98.0, specProp: 4.4, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'RAK Delhi (DL)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'ZrF4 98% ceramic opacifier for RAK Ceramics zirconium opalescent glaze &amp;#8594; 4.4 g/cm3 &amp;#8594; &amp;#8377;320Cr for 50 tonnes &amp;#8594; India &amp;#8377;2,200Cr ZrF4 ceramic &amp;#8594; RAK 10M sqm &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Glaze &amp;#8594; &amp;#8594; Ceramics' },
  { id: 'ZRF-0008', batchNo: 'ZRF-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Rare Earths', grade: 'ZrF4 99.7% Dental Ceramic', application: 'Dentsply Y-TZP Dental Crown', purityPercent: 99.7, specProp: 4.5, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan RE Udaipur (RJ)', destination: 'Dentsply Mumbai (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'ZrF4 99.7% dental precursor for Dentsply yttria-stabilized zirconia dental crown &amp;#8594; 4.5 g/cm3 &amp;#8594; &amp;#8377;440Cr for 30 tonnes &amp;#8594; India &amp;#8377;3,000Cr ZrF4 dental &amp;#8594; Dentsply 5M crowns &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Dent &amp;#8594; &amp;#8594; Medical' },
  { id: 'ZRF-0009', batchNo: 'ZRF-B2409', city: 'Guwahati', manufacturer: 'Assam Rare Earths', grade: 'ZrF4 97% Catalyst', application: 'IOCL Alkylation Catalyst', purityPercent: 97.0, specProp: 4.2, investmentCr: 380, status: 'In Transit', priority: 'Medium', origin: 'Assam RE Tezpur (AS)', destination: 'IOCL Paradip (OD)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'ZrF4 97% catalyst support for IOCL Paradip refinery alkylation ZrF4 solid acid catalyst &amp;#8594; 4.2 g/cm3 &amp;#8594; &amp;#8377;380Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,600Cr ZrF4 catalyst &amp;#8594; IOCL 3 refineries &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Pellet &amp;#8594; &amp;#8594; ZrF4Cat &amp;#8594; &amp;#8594; Refining' },
  { id: 'ZRF-0010', batchNo: 'ZRF-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Fluoride', grade: 'ZrF4 99.95% Fiber Optic', application: 'Jio Fluorozirconate Fiber', purityPercent: 99.95, specProp: 4.6, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Fluoride Ahmedabad (GJ)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'ZrF4 99.95% fluoride glass for Reliance Jio fluorozirconate IR fiber optic mid-IR transmission &amp;#8594; 4.6 g/cm3 &amp;#8594; &amp;#8377;880Cr for 15 tonnes &amp;#8594; India &amp;#8377;7,200Cr ZrF4 fiber &amp;#8594; Jio 100K km &amp;#8594; 99.95% purity &amp;#8594; &amp;#8594; Glass &amp;#8594; &amp;#8594; ZrF4Fiber &amp;#8594; &amp;#8594; Telecom' },
  { id: 'ZRF-0011', batchNo: 'ZRF-B2411', city: 'Lucknow', manufacturer: 'UP Fluorochemicals', grade: 'ZrF4 99% Anticorrosion', application: 'Tata Steel Pipeline ZrO2 Coat', purityPercent: 99.0, specProp: 4.6, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'UP Fluoro Kanpur (UP)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'ZrF4 99% precursor for Tata Steel pipeline zirconium dioxide anticorrosion ceramic coating &amp;#8594; 4.6 g/cm3 &amp;#8594; &amp;#8377;420Cr for 50 tonnes &amp;#8594; India &amp;#8377;2,800Cr ZrF4 coat &amp;#8594; Tata 2,000 km &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Pipe &amp;#8594; &amp;#8594; Steel' },
  { id: 'ZRF-0012', batchNo: 'ZRF-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Fluorochemicals', grade: 'ZrF4 99.9% Submarine Periscope', application: 'GRSE Project 75I Optronics Mast', purityPercent: 99.9, specProp: 1.52, investmentCr: 960, status: 'Delayed', priority: 'Critical', origin: 'Vizag Fluoro Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'ZrF4 99.9% submarine-grade for GRSE Project 75I optronics mast IR window &amp;#8597; nD 1.52 &amp;#8597; &amp;#8377;960Cr for 15 tonnes &amp;#8597; India &amp;#8377;7,800Cr ZrF4 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.9% purity &amp;#8597; &amp;#8594; Crystal &amp;#8597; &amp;#8594; ZrF4Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'ZRF-0013', batchNo: 'ZRF-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'ZrF4 99.8% Thermal Imaging', application: 'DRDO Nag IR Seeker Window', purityPercent: 99.8, specProp: 1.51, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'ZrF4 99.8% thermal-imaging grade for DRDO Nag anti-tank guided missile IR seeker window &amp;#8594; nD 1.51 &amp;#8594; &amp;#8377;860Cr for 20 tonnes &amp;#8594; India &amp;#8377;6,200Cr ZrF4 missile &amp;#8594; DRDO 500 missiles &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; ZrF4IR &amp;#8594; &amp;#8594; Defense' },
  { id: 'ZRF-0014', batchNo: 'ZRF-B2414', city: 'Rourkela', manufacturer: 'SAIL Fluoride', grade: 'ZrF4 96% Foundry', application: 'SAIL Rourkela Casting Mold', purityPercent: 96.0, specProp: 4.0, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'ZrF4 96% foundry-grade for SAIL steel casting mold zirconium-based wash coating &amp;#8594; 4.0 g/cm3 &amp;#8594; &amp;#8377;280Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,000Cr ZrF4 foundry &amp;#8594; SAIL 20 molds &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrF4Found &amp;#8594; &amp;#8594; Steel' },
];

export default function ZirconiumFluorideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Snowflake },
    { id: 'registry', label: 'Registry', icon: Snowflake },
    { id: 'analytics', label: 'Analytics', icon: Snowflake },
    { id: 'insights', label: 'Insights', icon: Snowflake },
  ];

  const filteredRecords = useMemo(() => {
    return zirconiumfluorideRecords.filter((r) => {
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
    zirconiumfluorideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = zirconiumfluorideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = zirconiumfluorideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / zirconiumfluorideRecords.length;
    const delayed = zirconiumfluorideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = zirconiumfluorideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#a21caf';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Zirconium Fluoride Logistics" description="Indian zirconium fluoride logistics supply chain tracking across 14 grades spanning aerospace, defense, additive manufacturing, pyrotechnics, optics, nuclear and automotive sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-fuchsia-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-fuchsia-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-fuchsia-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-fuchsia-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-fuchsia-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-fuchsia-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-fuchsia-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-fuchsia-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-fuchsia-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / zirconiumfluorideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = zirconiumfluorideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {zirconiumfluorideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Density/RI</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {zirconiumfluorideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; zirconiumfluorideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = zirconiumfluorideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; zirconiumfluorideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; zirconiumfluorideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / zirconiumfluorideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Optics &amp; Photonics Leadership</div><div className="text-xs text-muted-foreground mt-1">ISRO Chandrayaan-4 IR lens &#8594; DRDO DIRCM laser &#8594; BEL AESA radar dome &#8597; Jio fluoride fiber &#8594; &#8377;3,420Cr combined &#8594; frontier tech</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Defense &amp; Naval Programme</div><div className="text-xs text-muted-foreground mt-1">GRSE optronics mast &#8594; DRDO Nag IR seeker &#8594; &#8377;1,820Cr combined &#8594; strategic national assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Nuclear &amp; Energy</div><div className="text-xs text-muted-foreground mt-1">IGCAR PFBR molten salt &#8594; IOCL catalyst &#8594; &#8377;1,120Cr combined &#8594; critical infrastructure</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">ZRF-B2412 GRSE Project 75I optronics mast delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 ZrF4 grades spanning optical, laser, radar, nuclear, fiber, dental, welding, catalyst, missile, naval &#8594; avg purity 99.27%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">ISRO optical &#8594; DRDO DIRCM &#8594; IGCAR nuclear &#8594; Jio fiber &#8594; GRSE submarine &#8594; DRDO Nag &#8594; BEL radar</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; IRE &#8594; BHEL &#8594; Gujarat Fluoride lead strategic &#8594; Tata Steel &#8594; Rajasthan RE drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-fuchsia-500 bg-fuchsia-50/50"><div className="font-medium">Material Uniqueness</div><div className="text-xs text-muted-foreground mt-1">ZrF4 spans 96-99.99% purity &#8594; dual use: optical (nD 1.50-1.52) and industrial (density 3.8-4.6 g/cm3) &#8594; extremely niche mineral</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
