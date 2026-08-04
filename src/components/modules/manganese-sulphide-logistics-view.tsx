"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Pickaxe } from 'lucide-react';

interface ManganeseSulphideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; siMnContent: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const manganesesulphideRecords: ManganeseSulphideRecord[] = [
  { id: 'MNS-0001', batchNo: 'MNS-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'MnS 99.5% Pharmaceutical', application: 'Sun Pharma Vitamin Supplement', purityPercent: 99.5, siMnContent: 56.0, investmentCr: 840, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'Sun Pharma Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'MnS 99.5% pharmaceutical-grade for Sun Pharma manganese dietary supplement &amp;#8594; 56% Mn &amp;#8594; &amp;#8377;840Cr for 40 tonnes &amp;#8594; India &amp;#8377;5,600Cr MnS pharma &amp;#8594; Sun Pharma 500M doses &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; MnSPharma &amp;#8594; &amp;#8594; Pharma' },
  { id: 'MNS-0002', batchNo: 'MNS-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'MnS 98% Bearing Steel', application: 'BEL LCA Tejas Mk2 Engine Bearing', purityPercent: 98.0, siMnContent: 52.0, investmentCr: 760, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'MnS 98% bearing-grade for BEL Tejas Mk2 F414 engine main bearing inclusion modification &amp;#8594; 52% Mn &amp;#8594; &amp;#8377;760Cr for 85 tonnes &amp;#8594; India &amp;#8377;5,100Cr MnS aerospace &amp;#8594; BEL 40 aircraft &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Granule &amp;#8594; &amp;#8594; MnSBearing &amp;#8594; &amp;#8594; Defense' },
  { id: 'MNS-0003', batchNo: 'MNS-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'MnS 97% Machinability', application: 'Bharat Forge Free-Machining Steel', purityPercent: 97.0, siMnContent: 50.0, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'MnS 97% machinability-grade for Bharat Forge free-machining steel chip breaker &amp;#8594; 50% Mn &amp;#8594; &amp;#8377;680Cr for 200 tonnes &amp;#8594; India &amp;#8377;4,600Cr MnS machinability &amp;#8594; Bharat Forge 5M forgings &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Chip &amp;#8594; &amp;#8594; MnSMach &amp;#8594; &amp;#8594; Automotive' },
  { id: 'MNS-0004', batchNo: 'MNS-B2404', city: 'Hyderabad', manufacturer: 'Godrej Lubricants', grade: 'MnS 96% EP Additive', application: 'L&amp;T Naval Gearbox EP Grease', purityPercent: 96.0, siMnContent: 48.0, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Godrej Mumbai (MH)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'MnS 96% extreme-pressure additive for L&amp;amp;T naval gearbox EP solid lubricant &amp;#8594; 48% Mn &amp;#8594; &amp;#8377;520Cr for 60 tonnes &amp;#8594; India &amp;#8377;3,400Cr MnS lubricant &amp;#8594; L&amp;amp;T 30 gearboxes &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; MnSEP &amp;#8594; &amp;#8594; Naval' },
  { id: 'MNS-0005', batchNo: 'MNS-B2405', city: 'Kolkata', manufacturer: 'Shyam Chemicals', grade: 'MnS 95% Fertilizer', application: 'IFFCO Kharif Season Mn Fertilizer', purityPercent: 95.0, siMnContent: 46.0, investmentCr: 360, status: 'In Transit', priority: 'Medium', origin: 'Shyam Chemicals Kolkata (WB)', destination: 'IFFCO Paradeep (OD)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'MnS 95% fertilizer-grade for IFFCO kharif season manganese micronutrient fertilizer &amp;#8594; 46% Mn &amp;#8594; &amp;#8377;360Cr for 300 tonnes &amp;#8594; India &amp;#8377;2,400Cr MnS fertilizer &amp;#8594; IFFCO 5M farmers &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Granule &amp;#8594; &amp;#8594; MnSFert &amp;#8594; &amp;#8594; Agriculture' },
  { id: 'MNS-0006', batchNo: 'MNS-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'MnS 98% Welding Wire', application: 'BHEL Submerged Arc Welding', purityPercent: 98.0, siMnContent: 52.0, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Haridwar (UK)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'MnS 98% welding-grade for BHEL submerged arc welding flux manganese supplement &amp;#8594; 52% Mn &amp;#8594; &amp;#8377;640Cr for 110 tonnes &amp;#8594; India &amp;#8377;4,200Cr MnS welding &amp;#8594; BHEL 40 welders &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Wire &amp;#8594; &amp;#8594; MnSWeld &amp;#8594; &amp;#8594; Power' },
  { id: 'MNS-0007', batchNo: 'MNS-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'MnS 97% Resulphurized', application: 'Mahindra XUV400 EV Gearbox', purityPercent: 97.0, siMnContent: 50.0, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'MnS 97% resulphurized-grade for Mahindra XUV400 EV gearbox free-machining steel &amp;#8594; 50% Mn &amp;#8594; &amp;#8377;440Cr for 100 tonnes &amp;#8594; India &amp;#8377;2,800Cr MnS EV &amp;#8594; Mahindra 50K gearboxes &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Inclusion &amp;#8594; &amp;#8594; MnSResul &amp;#8594; &amp;#8594; Automotive' },
  { id: 'MNS-0008', batchNo: 'MNS-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Chemicals', grade: 'MnS 96% Ceramic Glaze', application: 'RAK Ceramics Purple Pigment', purityPercent: 96.0, siMnContent: 48.0, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'Rajasthan Chemicals Udaipur (RJ)', destination: 'RAK Ceramics Delhi (DL)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'MnS 96% ceramic-grade for RAK Ceramics purple manganese sulphide glaze pigment &amp;#8594; 48% Mn &amp;#8594; &amp;#8377;320Cr for 50 tonnes &amp;#8594; India &amp;#8377;2,000Cr MnS ceramic &amp;#8594; RAK 10M sqm &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Pigment &amp;#8594; &amp;#8594; MnSCeram &amp;#8594; &amp;#8594; Ceramics' },
  { id: 'MNS-0009', batchNo: 'MNS-B2409', city: 'Guwahati', manufacturer: 'Assam Chemicals', grade: 'MnS 94% Batteries', application: 'Exide Industries MnO2 Cell', purityPercent: 94.0, siMnContent: 44.0, investmentCr: 480, status: 'In Transit', priority: 'Medium', origin: 'Assam Chemicals Tezpur (AS)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'MnS 94% battery-grade for Exide Leclanche dry cell manganese dioxide precursor &amp;#8594; 44% Mn &amp;#8594; &amp;#8377;480Cr for 80 tonnes &amp;#8594; India &amp;#8377;3,200Cr MnS battery &amp;#8594; Exide 100M cells &amp;#8594; 94.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; MnSBatt &amp;#8594; &amp;#8594; Battery' },
  { id: 'MNS-0010', batchNo: 'MNS-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Chemicals', grade: 'MnS 99% Nuclear Grade', application: 'IGCAR PFBR Control Rod', purityPercent: 99.0, siMnContent: 54.0, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Chemicals Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'MnS 99% nuclear-grade for IGCAR Prototype Fast Breeder Reactor control rod absorber precursor &amp;#8594; 54% Mn &amp;#8594; &amp;#8377;900Cr for 35 tonnes &amp;#8594; India &amp;#8377;7,400Cr MnS nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Crystal &amp;#8594; &amp;#8594; MnSNuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'MNS-0011', batchNo: 'MNS-B2411', city: 'Lucknow', manufacturer: 'UP Chemicals', grade: 'MnS 95% Water Treatment', application: 'NTPC FGD Water Treatment', purityPercent: 95.0, siMnContent: 46.0, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'UP Chemicals Kanpur (UP)', destination: 'NTPC Singrauli (MP)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'MnS 95% water-treatment grade for NTPC flue gas desulphurization manganese catalyst &amp;#8594; 46% Mn &amp;#8594; &amp;#8377;380Cr for 70 tonnes &amp;#8594; India &amp;#8377;2,600Cr MnS water &amp;#8594; NTPC 20 plants &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Pellet &amp;#8594; &amp;#8594; MnSFGD &amp;#8594; &amp;#8594; Power' },
  { id: 'MNS-0012', batchNo: 'MNS-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Chemicals', grade: 'MnS 98% Submarine Steel', application: 'GRSE Project 75I Pressure Hull', purityPercent: 98.0, siMnContent: 52.0, investmentCr: 920, status: 'Delayed', priority: 'Critical', origin: 'Vizag Chemicals Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'MnS 98% submarine-grade for GRSE Project 75I pressure hull HY-80 steel inclusion control &amp;#8594; 52% Mn &amp;#8597; &amp;#8377;920Cr for 60 tonnes &amp;#8597; India &amp;#8377;7,600Cr MnS submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 98.0% purity &amp;#8597; &amp;#8594; Master &amp;#8594; &amp;#8594; MnSSub &amp;#8597; &amp;#8594; Naval' },
  { id: 'MNS-0013', batchNo: 'MNS-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'MnS 97% Missile Steel', application: 'DRDO Pralay Warhead Casing', purityPercent: 97.0, siMnContent: 50.0, investmentCr: 820, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'MnS 97% missile-grade for DRDO Pralay tactical ballistic missile warhead casing steel &amp;#8594; 50% Mn &amp;#8594; &amp;#8377;820Cr for 55 tonnes &amp;#8594; India &amp;#8377;5,800Cr MnS missile &amp;#8594; DRDO 150 missiles &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Ingot &amp;#8594; &amp;#8594; MnSMsl &amp;#8594; &amp;#8594; Defense' },
  { id: 'MNS-0014', batchNo: 'MNS-B2414', city: 'Rourkela', manufacturer: 'SAIL Chemicals', grade: 'MnS 93% General Steel', application: 'SAIL Rail Steel Inclusion Control', purityPercent: 93.0, siMnContent: 42.0, investmentCr: 340, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'MnS 93% general steel-grade for SAIL rail steel manganese sulphide inclusion modification &amp;#8594; 42% Mn &amp;#8594; &amp;#8377;340Cr for 180 tonnes &amp;#8594; India &amp;#8377;2,200Cr MnS rail &amp;#8594; SAIL 2M tonnes &amp;#8594; 93.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; MnSGen &amp;#8594; &amp;#8594; Steel' },
];

export default function ManganeseSulphideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Pickaxe },
    { id: 'registry', label: 'Registry', icon: Pickaxe },
    { id: 'analytics', label: 'Analytics', icon: Pickaxe },
    { id: 'insights', label: 'Insights', icon: Pickaxe },
  ];

  const filteredRecords = useMemo(() => {
    return manganesesulphideRecords.filter((r) => {
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
    manganesesulphideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = manganesesulphideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = manganesesulphideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / manganesesulphideRecords.length;
    const delayed = manganesesulphideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = manganesesulphideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#0d9488';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Manganese Sulphide Logistics" description="Indian manganese sulphide logistics supply chain tracking across 14 grades spanning steelmaking, foundry, defense, automotive, aerospace and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-teal-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-teal-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-teal-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / manganesesulphideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = manganesesulphideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {manganesesulphideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Mn Content</span><span className="font-medium">{record.siMnContent}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {manganesesulphideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; manganesesulphideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = manganesesulphideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; manganesesulphideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; manganesesulphideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / manganesesulphideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Pharma &amp; Nuclear Leadership</div><div className="text-xs text-muted-foreground mt-1">Sun Pharma vitamin supplement &#8594; IGCAR PFBR control rod &#8594; &#8377;1,740Cr combined &#8594; highest purity segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Defense &amp; Naval Programme</div><div className="text-xs text-muted-foreground mt-1">BEL Tejas engine bearing &#8594; GRSE submarine hull &#8594; DRDO Pralay warhead &#8594; &#8377;2,500Cr combined &#8594; strategic assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Steel &amp; Manufacturing</div><div className="text-xs text-muted-foreground mt-1">Bharat Forge machinability &#8594; SAIL rail inclusion &#8594; Mahindra EV gearbox &#8594; &#8377;1,460Cr combined &#8594; industrial backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">MNS-B2412 GRSE Project 75I pressure hull delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Total Portfolio: &#8377;8,780 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 MnS grades spanning pharma, defense, nuclear, steel, battery, ceramic, water treatment and lubricant sectors &#8594; avg purity 97.04%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Critical Priority: 6 Records</div><div className="text-xs text-muted-foreground mt-1">Sun Pharma &#8594; BEL Tejas &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Pralay &#8594; BHEL welding</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Sun Pharma lead strategic demand &#8594; Godrej &#8594; Exide drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-teal-500 bg-teal-50/50"><div className="font-medium">Purity Spectrum</div><div className="text-xs text-muted-foreground mt-1">Range 93-99.5% purity &#8594; pharma grade highest at 99.5% &#8594; nuclear grade 99% &#8594; general steel 93% &#8594; sector-specific QC critical</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
