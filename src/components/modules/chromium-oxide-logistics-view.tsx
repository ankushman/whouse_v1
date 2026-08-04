"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Palette } from 'lucide-react';

interface ChromiumOxideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; oxideGrade: string;
  application: string; purityPercent: number; hardnessGPa: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
}

const chromiumOxideRecords: ChromiumOxideRecord[] = [
  { id: 'CRO-0001', batchNo: 'CRO-B2401', city: 'Mumbai', manufacturer: 'India Chrome', oxideGrade: 'Cr2O3 Pigment 99%', application: 'Asian Paints Automotive', purityPercent: 99.2, hardnessGPa: 8.5, investmentCr: 760, status: 'Delivered', priority: 'High', origin: 'India Chrome Mumbai (MH)', destination: 'Asian Paints Mumbai (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Chromium oxide green pigment for Asian Paints automotive OEM polyurethane topcoat &#8594; DPP grade &#8594; &#8377;760Cr for 3,000 tonnes &#8594; India &#8377;4,200Cr pigment &#8594; Asian 50M litres &#8594; 8.5 Mohs &#8594; &#8594; Pigment &#8594; &#8594; 240&#176;C &#8594; &#8594; Coatings' },
  { id: 'CRO-0002', batchNo: 'CRO-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', oxideGrade: 'Cr2O3 Ceramic 99.5%', application: 'ISRO TPS Coating', purityPercent: 99.5, hardnessGPa: 9.2, investmentCr: 920, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'High-purity chromia ceramic for ISRO reusable launch vehicle thermal protection system plasma spray &#8594; APS grade &#8594; &#8377;920Cr for 600 tonnes &#8594; India &#8377;7,800Cr TPS &#8594; ISRO 6 vehicles &#8594; 9.2 GPa &#8594; &#8594; Ceramic &#8594; &#8594; 1400&#176;C &#8594; &#8594; Space' },
  { id: 'CRO-0003', batchNo: 'CRO-B2403', city: 'Chennai', manufacturer: 'Tata Steel Chromite', oxideGrade: 'Cr2O3 Refractory 98%', application: 'SAIL AOD Vessel', purityPercent: 98.3, hardnessGPa: 7.8, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Sukinda (OD)', destination: 'SAIL Durgapur (WB)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Chromia refractory brick for SAIL Durgapur argon oxygen decarburization vessel lining &#8594; 98% Cr2O3 &#8594; &#8377;680Cr for 2,500 tonnes &#8594; India &#8377;5,400Cr refractory &#8594; SAIL 4 AOD &#8594; 7.8 GPa &#8594; &#8594; Brick &#8594; &#8594; 1700&#176;C &#8594; &#8594; Steel' },
  { id: 'CRO-0004', batchNo: 'CRO-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge Chrome', oxideGrade: 'Cr2O3 Metallurgical 96%', application: 'Bharat Forge Crankshaft', purityPercent: 96.5, hardnessGPa: 8.1, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Pune (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Chromium oxide for Bharat Forge crankshaft chrome plating and surface hardening &#8594; HVOF grade &#8594; &#8377;720Cr for 2,000 tonnes &#8594; India &#8377;5,800Cr metallurgical &#8594; Bharat 200K shafts &#8594; 8.1 GPa &#8594; &#8594; Plating &#8594; &#8594; 500&#176;C &#8594; &#8594; Auto' },
  { id: 'CRO-0005', batchNo: 'CRO-B2405', city: 'Kolkata', manufacturer: 'Shalimar Paints', oxideGrade: 'Cr2O3 Camo Green 99%', application: 'BEL DRDO Camo Net', purityPercent: 99.1, hardnessGPa: 7.5, investmentCr: 580, status: 'In Transit', priority: 'Medium', origin: 'Shalimar Paints Kolkata (WB)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Chromium oxide green pigment for BEL DRDO camouflage netting and vehicle NIR signature paint &#8594; mil spec &#8594; &#8377;580Cr for 1,200 tonnes &#8594; India &#8377;3,200Cr military &#8594; BEL 100K sets &#8594; 7.5 Mohs &#8594; &#8594; NIR &#8594; &#8594; 300&#176;C &#8594; &#8594; Defence' },
  { id: 'CRO-0006', batchNo: 'CRO-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Chrome Chem', oxideGrade: 'Cr2O3 Tanning 97%', application: 'Tata Leather Tannery', purityPercent: 97.4, hardnessGPa: 5.5, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Chrome Chem Ahmedabad (GJ)', destination: 'Tata Leather Kolkata (WB)', shipDate: '2026-07-26', transitDays: 3, zone: 'West', remarks: 'Basic chromium sulfate tanning agent for Tata Leather automotive upholstery chrome tanning &#8594; BCS grade &#8594; &#8377;440Cr for 4,000 tonnes &#8594; India &#8377;1,800Cr tanning &#8594; Tata 5M hides &#8594; 5.5 Mohs &#8594; &#8594; BCS &#8594; &#8594; 120&#176;C &#8594; &#8594; Leather' },
  { id: 'CRO-0007', batchNo: 'CRO-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Chromite', oxideGrade: 'Cr2O3 Abrasive 96%', application: 'Grindwell Norton Wheel', purityPercent: 96.2, hardnessGPa: 9.0, investmentCr: 620, status: 'In Transit', priority: 'High', origin: 'Rajasthan Chromite Udaipur (RJ)', destination: 'Grindwell Norton Bengaluru (KA)', shipDate: '2026-07-28', transitDays: 2, zone: 'West', remarks: 'Chromium oxide abrasive grain for Grindwell Norton precision grinding wheel vitrified bond &#8594; A46 grade &#8594; &#8377;620Cr for 2,500 tonnes &#8594; India &#8377;4,600Cr abrasive &#8594; Norton 500K wheels &#8594; 9.0 Mohs &#8594; &#8594; Abrasive &#8594; &#8594; 1200&#176;C &#8594; &#8594; Abrasives' },
  { id: 'CRO-0008', batchNo: 'CRO-B2408', city: 'Coimbatore', manufacturer: 'TN Chrome Products', oxideGrade: 'Cr2O3 Glass 99.3%', application: 'Asahi India Container', purityPercent: 99.3, hardnessGPa: 6.8, investmentCr: 520, status: 'Delivered', priority: 'Medium', origin: 'TN Chrome Products Chennai (TN)', destination: 'Asahi India Mumbai (MH)', shipDate: '2026-07-30', transitDays: 1, zone: 'South', remarks: 'Chromium oxide glass colourant for Asahi India green-tinted beverage container glass &#8594; emerald &#8594; &#8377;520Cr for 1,500 tonnes &#8594; India &#8377;2,800Cr glass &#8594; Asahi 800M bottles &#8594; 6.8 Mohs &#8594; &#8594; Glass &#8594; &#8594; 1500&#176;C &#8594; &#8594; Glass' },
  { id: 'CRO-0009', batchNo: 'CRO-B2409', city: 'Guwahati', manufacturer: 'Assam Chromite', oxideGrade: 'Cr2O3 Ore Beneficiation', application: 'NALCO Ferro Chrome', purityPercent: 94.8, hardnessGPa: 7.2, investmentCr: 380, status: 'Delivered', priority: 'Low', origin: 'Assam Chromite Dima Hasao (AS)', destination: 'NALCO Damanjodi (OD)', shipDate: '2026-08-01', transitDays: 5, zone: 'East', remarks: 'Chromite ore concentrate for NALCO ferro chrome smelter charge feed &#8594; 46% Cr2O3 &#8594; &#8377;380Cr for 15,000 tonnes &#8594; India &#8377;1,200Cr ore &#8594; NALCO 3 smelters &#8594; 7.2 Mohs &#8594; &#8594; Ore &#8594; &#8594; 1800&#176;C &#8594; &#8594; Mining' },
  { id: 'CRO-0010', batchNo: 'CRO-B2410', city: 'Lucknow', manufacturer: 'UP Chrome Industries', oxideGrade: 'Cr2O3 Ceramic 99.8%', application: 'CSIR-NAL Coating', purityPercent: 99.8, hardnessGPa: 9.5, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'UP Chrome Kanpur (UP)', destination: 'CSIR-NAL Bengaluru (KA)', shipDate: '2026-08-03', transitDays: 2, zone: 'North', remarks: 'Ultra-high purity chromia for CSIR-NAL thermal barrier coating APS powder for HAL Tejas engine &#8594; 99.8% &#8594; &#8377;720Cr for 800 tonnes &#8594; India &#8377;6,400Cr TBC &#8594; NAL 200 engines &#8594; 9.5 GPa &#8594; &#8594; TBC &#8594; &#8594; 1200&#176;C &#8594; &#8594; Aero' },
  { id: 'CRO-0011', batchNo: 'CRO-B2411', city: 'Nagpur', manufacturer: 'BHEL Chromite Div', oxideGrade: 'Cr2O3 Welding 97%', application: 'L&amp;T Welding Rod', purityPercent: 97.1, hardnessGPa: 7.5, investmentCr: 540, status: 'In Transit', priority: 'Medium', origin: 'BHEL Bhopal (MP)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-08-05', transitDays: 2, zone: 'West', remarks: 'Chromium oxide flux for L&amp;T E308L stainless steel welding rod and flux cored wire coating &#8594; AWS A5.4 &#8594; &#8377;540Cr for 2,000 tonnes &#8594; India &#8377;3,400Cr welding &#8594; L&amp;T 50K tonnes &#8594; 7.5 Mohs &#8594; &#8594; Flux &#8594; &#8594; 600&#176;C &#8594; &#8594; Welding' },
  { id: 'CRO-0012', batchNo: 'CRO-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Chrome Works', oxideGrade: 'Cr2O3 Naval 99.4%', application: 'GRSE Submarine Hull', purityPercent: 99.4, hardnessGPa: 8.8, investmentCr: 680, status: 'Delayed', priority: 'Critical', origin: 'Vizag Chrome Visakha (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-08-07', transitDays: 2, zone: 'East', remarks: 'Chromia ceramic tile for GRSE Project 75I submarine hull sonar dome acoustic tiling &#8594; 99.4% &#8594; &#8377;680Cr for 600 tonnes &#8597; India &#8377;5,800Cr naval &#8594; GRSE 4 submarines &#8594; 8.8 GPa &#8594; &#8594; Acoustic &#8594; &#8594; 1100&#176;C &#8594; &#8594; Naval' },
  { id: 'CRO-0013', batchNo: 'CRO-B2413', city: 'Bhopal', manufacturer: 'IGCAR Nuclear', oxideGrade: 'Cr2O3 Control Rod 99.9%', application: 'NPCIL PHWR Absorber', purityPercent: 99.9, hardnessGPa: 9.8, investmentCr: 940, status: 'In Transit', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'NPCIL Rawatbhata (RJ)', shipDate: '2026-08-09', transitDays: 2, zone: 'Central', remarks: 'Ultra-high purity chromia sinter for NPCIL PHWR 700 control rod neutron absorber material &#8594; 99.9% &#8594; &#8377;940Cr for 400 tonnes &#8594; India &#8377;9,400Cr nuclear &#8594; NPCIL 8 reactors &#8594; 9.8 GPa &#8594; &#8594; Absorber &#8594; &#8594; 800&#176;C &#8594; &#8594; Nuclear' },
  { id: 'CRO-0014', batchNo: 'CRO-B2414', city: 'Rourkela', manufacturer: 'SAIL Chromite Mine', oxideGrade: 'Cr2O3 Foundry 95%', application: 'Tata Steel Casting', purityPercent: 95.5, hardnessGPa: 7.0, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-08-11', transitDays: 1, zone: 'East', remarks: 'Foundry chromite sand facing for Tata Steel heavy steel casting mould and core facing &#8594; AFS 55 &#8594; &#8377;420Cr for 6,000 tonnes &#8594; India &#8377;2,200Cr foundry &#8594; Tata 10 castings &#8594; 7.0 Mohs &#8594; &#8594; Foundry &#8594; &#8594; 1400&#176;C &#8594; &#8594; Steel' },
];

export default function ChromiumOxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Palette },
    { id: 'registry', label: 'Registry', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: Palette },
    { id: 'insights', label: 'Insights', icon: Palette },
  ];

  const filteredRecords = useMemo(() => {
    return chromiumOxideRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.oxideGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    chromiumOxideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = chromiumOxideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = chromiumOxideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / chromiumOxideRecords.length;
    const delayed = chromiumOxideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = chromiumOxideRecords.filter((r) => r.priority === 'Critical').length;
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
      <PageHeader title="Chromium Oxide Logistics" description="Indian chromium oxide pigment, refractory, ceramic TPS, abrasive, tanning and nuclear absorber supply chain tracking across 14 grades" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / chromiumOxideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = chromiumOxideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chromiumOxideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.oxideGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.oxideGrade}</span></div>
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {chromiumOxideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; chromiumOxideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = chromiumOxideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; chromiumOxideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99.5%+': 0, '99-99.4%': 0, '96-98.9%': 0, '<96%': 0 }; chromiumOxideRecords.forEach((r) => { if (r.purityPercent >= 99.5) ranges['99.5%+']++; else if (r.purityPercent >= 99) ranges['99-99.4%']++; else if (r.purityPercent >= 96) ranges['96-98.9%']++; else ranges['<96%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / chromiumOxideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Nuclear Absorber Demand</div><div className="text-xs text-muted-foreground mt-1">NPCIL PHWR 700 and BARC research reactor programme driving 99.9% chromia absorber &#8594; &#8377;940Cr for 400 tonnes &#8594; critical national security</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Space TPS Growth</div><div className="text-xs text-muted-foreground mt-1">ISRO RLV and GSLV Mk3 expansion &#8594; chromia ceramic TPS + NAL TBC &#8594; &#8377;1,640Cr combined for aerospace coatings</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Defence Camouflage</div><div className="text-xs text-muted-foreground mt-1">BEL DRDO NIR camouflage netting and vehicle paint &#8594; chromia green pigment military specification &#8594; &#8377;580Cr for 1,200 tonnes</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">CRO-B2412 GRSE submarine sonar dome delayed &#8594; monsoon Visakhapatnam &#8594; Project 75I Kalvari-class delivery risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 chromia grades spanning coatings, refractory, aerospace, defence, abrasive, glass, welding, tanning, naval and nuclear &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">ISRO TPS &#8594; CSIR-NAL TBC &#8594; GRSE submarine &#8594; NPCIL absorber &#8594; strategic programmes</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Top Applications</div><div className="text-xs text-muted-foreground mt-1">Nuclear absorber &#8594; aerospace TPS/TBC &#8594; automotive coating &#8594; steel refractory &#8594; abrasive grinding &#8594; 5 sectors above &#8377;600Cr</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-violet-500 bg-violet-50/50"><div className="font-medium">Import Dependency</div><div className="text-xs text-muted-foreground mt-1">High-purity 99.5%+ chromia still 40% imported &#8594; Sukinda chromite expansion and UP Chrome capacity ramp critical for Atmanirbhar</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
